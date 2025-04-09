import { useState, useCallback, useMemo } from 'react';
import humps from 'humps';

import promiseRequest from '../promise-request';
import caller from './caller';

const transform = (data) => humps.camelizeKeys(data.data || data);

function useGetMatesPending() {
  const requestAction = useMemo(() => promiseRequest(caller, transform), []);
  const [loading, setLoading] = useState(false);
  const handleRequest = useCallback((params) => requestAction(params), [
    requestAction,
  ]);
  const getMatesPending = useCallback(
    async (payload) => {
      setLoading(true);

      const { data, error } = await handleRequest(payload);
      setLoading(false);

      if (error) {
        return Promise.reject(error);
      }
      return Promise.resolve(data);
    },
    [handleRequest],
  );

  return {
    getMatesPending,
    loadingGetMatesPending: loading,
  };
}

export default useGetMatesPending;
