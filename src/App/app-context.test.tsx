import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import faker from 'faker';

import { notificationsMock } from '../../test-utils/mocks/notificationsMock';

import { AppProvider, useApp, useCurrentProjectParams } from './app-context';

describe('AppProvider', () => {
  function createProject(params: { vid?: string; version?: number } = {}) {
    return {
      vid: params.vid ?? faker.random.uuid(),
      version: params.version ?? faker.random.number(100),
    };
  }
  const currentProjectMock = {
    get: jest.fn(),
  };

  const busSpy = {
    send: jest.fn(),
    subscriptions: [] as VoidFunction[],
    triggerLastSubscription() {
      this.subscriptions[this.subscriptions.length - 1]();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribe(pattern: any, callback: any) {
      this.subscriptions.push(callback);
      return () => {
        this.subscriptions.splice(this.subscriptions.indexOf(callback), 1);
      };
    },
  };

  beforeEach(() => {
    currentProjectMock.get.mockReset();
    busSpy.subscriptions = [];
  });

  const wrapper: React.FC = ({ children }) => (
    <AppProvider
      bus={busSpy}
      currentProject={currentProjectMock}
      notifications={notificationsMock}
      setServerError={() => {}}
    >
      {children}
    </AppProvider>
  );

  describe('useApp', () => {
    test('выкидывает исключение, если хук вызван вне провайдера', () => {
      const { result } = renderHook(() => useApp());
      expect(result.error).not.toBeUndefined();
    });
  });

  describe('useCurrentProjectParams', () => {
    test('возвращает текущий проект', () => {
      const project = createProject();

      currentProjectMock.get.mockReturnValueOnce(project);

      const { result } = renderHook(() => useCurrentProjectParams(), {
        wrapper,
      });

      expect(result.current).toBe(project);
    });

    test('данные проекта обновляются', () => {
      const projectV1 = createProject();
      const projectV2 = { ...projectV1, version: projectV1.version + 1 };

      currentProjectMock.get.mockReturnValueOnce(projectV1).mockReturnValueOnce(projectV2);

      const { result } = renderHook(() => useCurrentProjectParams(), {
        wrapper,
      });

      expect(result.current).toBe(projectV1);

      act(() => {
        busSpy.triggerLastSubscription();
      });

      expect(result.current).toBe(projectV2);
    });

    test('выкидывает исключение, если хук вызван без активного проекта', () => {
      currentProjectMock.get.mockReturnValueOnce(null);

      const { result } = renderHook(() => useCurrentProjectParams(), {
        wrapper,
      });

      expect(result.error).not.toBeUndefined();
    });
  });
});
