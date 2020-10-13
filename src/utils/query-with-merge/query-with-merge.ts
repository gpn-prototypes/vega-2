// import * as jsonDiffPatch from 'jsondiffpatch';

type FormValueWithKey = Record<string, unknown>;

type Params = {
  query(): Promise<FormValueWithKey>;
  mutation(data: FormValueWithKey): Promise<FormValueWithKey>;
};

type Buffer = FormValueWithKey[];

export class QueryWithMerge {
  private query: Params['query'];

  private mutation: Params['mutation'];

  private buffer: Buffer;

  private isSyncActive: boolean;

  private intervalId: ReturnType<typeof setInterval> | undefined;

  constructor({ query, mutation }: Params) {
    this.query = query;
    this.mutation = mutation;
    this.buffer = [];
    this.isSyncActive = false;
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

  private getMergedBaseDataAndBuffer(): FormValueWithKey {
    const objFromBuffer = this.getObjectFromBuffer();
    const baseData = {}; // = получить из кеша аполло;
    return { ...baseData, ...objFromBuffer };
  }

  // по расписанию берём данные из buffer, запускаем синхронизацию sink и очищаем buffer
  private scheduler() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        if (!this.isSyncActive) {
          const args = this.getMergedBaseDataAndBuffer();

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

    const mutationResult = await this.mutation(args);

    // while (mutationResult.code === 'PROJECT_VERSION_DIFF_ERROR') {
    //   const currentDataOnServer = this.query();
    //   const diff = jsonDiffPatch.diff(args, currentDataOnServer);
    //   if (diff) {
    //     const patchedData = jsonDiffPatch.patch(args, diff);
    //     mutationResult = await this.mutation(patchedData);
    //   }
    // }

    const newData = this.getObjectWithoutBufferData(mutationResult);

    // обновляем данные в кеше вручную за исключением данных из буфера (newData в кеш аполло)

    this.isSyncActive = false;
  };

  // остановить планировщик
  public destroy = (): void => {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  };
}
