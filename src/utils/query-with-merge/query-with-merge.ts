// import * as jsonDiffPatch from 'jsondiffpatch';

import { ApolloClient, DocumentNode, NormalizedCacheObject } from '@apollo/client';
import deepmerge from 'deepmerge';
// TODO:
// 1. прокинуть клиент для выполнения запросов и мутаций
// 2. прокинуть запросы, запросы нужно формировать внутри сервиса управляя конечную точку — сервер/кеш аполло
// 3. переделать запросы

type FormValueWithKey = Record<string, unknown>;

type Params = {
  query: DocumentNode;
  mutation: DocumentNode;
  client: ApolloClient<NormalizedCacheObject>;
};

type Buffer = FormValueWithKey[];

function deepMerge(...objects: Record<string, unknown>[]) {
  const isObject = (obj: unknown) => obj && typeof obj === 'object';

  function deepMergeInner(target: Record<string, unknown>, source: Record<string, unknown>) {
    Object.keys(source).forEach((key: string) => {
      const targetValue = target[key];
      const sourceValue = source[key];

      console.log({ targetValue, sourceValue });

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = deepMergeInner({ ...targetValue }, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  }

  if (objects.length < 2) {
    throw new Error('deepMerge: this function expects at least 2 objects to be provided');
  }

  if (objects.some((object) => !isObject(object))) {
    throw new Error('deepMerge: all values should be of type "object"');
  }

  const target = objects.shift();
  let source: Record<string, unknown> | undefined;

  while ((source = objects.shift())) {
    deepMergeInner(target, source);
  }

  return target;
}

export class QueryWithMerge {
  private query: Params['query'];

  private mutation: Params['mutation'];

  private buffer: Buffer;

  private isSyncActive: boolean;

  private intervalId: ReturnType<typeof setInterval> | undefined;

  private client: Params['client'];

  constructor({ query, mutation, client }: Params) {
    this.query = query;
    this.mutation = mutation;
    this.buffer = [];
    this.isSyncActive = false;
    this.client = client;
  }

  // забираем данные из формы и кладём их buffer
  public update = (data: FormValueWithKey): void => {
    this.buffer = [...this.buffer, data];
    this.scheduler();
  };

  private getObjectFromBuffer() {
    return this.buffer.reduce((acc, curValue) => ({ ...acc, ...curValue }), {});
  }

  private getObjectWithoutBufferData(data: FormValueWithKey) {
    const bufferObj = this.getObjectFromBuffer();
    const bufferKeys = Object.keys(bufferObj);
    const dataKeys = Object.keys(data);
    return dataKeys.reduce((acc, key) => {
      return bufferKeys.indexOf(key) < 0 ? { ...acc, [key]: data[key] } : acc;
    }, {});
  }

  private getMergedBaseDataAndBuffer = async () => {
    const objFromBuffer = this.getObjectFromBuffer();
    const { data: baseData }: { data: FormValueWithKey } = await this.client.query({
      query: this.query,
      fetchPolicy: 'cache-only',
    }); // TODO: получить из кеша аполло;

    return deepmerge(baseData, objFromBuffer); // TODO сделать «глубокое» слияние объектов;
  };

  // по расписанию берём данные из buffer, запускаем синхронизацию sink и очищаем buffer
  private async scheduler() {
    if (!this.intervalId) {
      this.intervalId = setInterval(async () => {
        if (!this.isSyncActive) {
          const args = await this.getMergedBaseDataAndBuffer();
          this.sink(args);
          this.buffer = [];
        }
      }, 1000);
    }
  }

  // блокируем планировщик
  // вызываем мутацию
  // мутация вызывает успех → обновляем baseData, разблокируем планировщик, отправляем baseData, кроме данных из buffer в форму.
  // мутация возвращает конфликт → дёргаем query и сохраняем в переменную, находим разницу м\у этими данными с сервера и arg
  // разницу накатываем на arg и с обновленным arg вызываем снова мутацию, до тех пор пока не будет успех
  private sink = async (args: FormValueWithKey) => {
    this.isSyncActive = true;

    const { data } = await this.client.mutate({
      mutation: this.mutation,
      variables: args,
    });

    console.log(data);

    // const result = this.client.mutate({
    //   mutation: this.mutation,
    //   variables: args,
    // });

    // const mutationResult = result;

    // TODO: настроить выполнение запросов с разрешением конфликтов
    // while (mutationResult.code === 'PROJECT_VERSION_DIFF_ERROR') {
    //   const currentDataOnServer = this.query();
    //   const diff = jsonDiffPatch.diff(args, currentDataOnServer);
    //   if (diff) {
    //     const patchedData = jsonDiffPatch.patch(args, diff);
    //     mutationResult = await this.mutation(patchedData);
    //   }
    // }

    // const updatedData = this.getObjectWithoutBufferData(mutationResult);

    // TODO: сделать обновление данных, за исключением данных из буфера (result.data в кеш аполло), в кеше вручную
    this.client.cache.writeQuery({
      query: this.query,
      data: { data },
    });

    this.isSyncActive = false;
  };

  // остановить планировщик
  public destroy = (): void => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  };
}
