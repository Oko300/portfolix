import { useState, useEffect } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';

const useFetch = (url, initialState = null) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
        toast.error(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error, setData }; // setData allows external updates if needed
};

export default useFetch;