import React, { useReducer, useContext } from "react";
import axios from "axios";
import reducer from "./reducer";
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_INPUT_CHANGE,
  CLEAR_INPUT_FIELDS,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE
} from "./actions";

const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const userLocation = localStorage.getItem('location');

const initialState = {
  //user-info
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token || null,
  userLocation: userLocation || '',
  showSideBar: false,
  //add-job
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',
  //all-jobs
  jobs: [],
  totalJobs: 0,
  page: 1,
  numOfPages: 1,
  stats: {},
  monthlyApplications: [],
  //searching, filtering and sorting
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a']
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: '/api/v1'
  });

  // request/response interceptors
  authFetch.interceptors.request.use(
    (config) => {
      config.headers['Authorization'] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () =>{
    dispatch({ type: DISPLAY_ALERT });
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3500);
  };

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('location', location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('location');
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN })
    try {
      const response = await axios.post('/api/v1/auth/register', currentUser);
      const user = response.data;
      const { token, location } = response.data;
      dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token, location }});
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({ type: REGISTER_USER_ERROR, payload: { msg: error.response.data.msg }});
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const response = await axios.post('/api/v1/auth/login', currentUser);
      const user = response.data;
      const { token, location } = response.data;
      dispatch({ type: LOGIN_USER_SUCCESS, payload: { user, token, location }});
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({ type: LOGIN_USER_ERROR, payload: { msg: error.response.data.msg }});
    }
    clearAlert();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, location, token } = data;
      dispatch({ type: UPDATE_USER_SUCCESS, payload: { user, token, location }});
      addUserToLocalStorage({ user, location, token });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({ type: UPDATE_USER_ERROR, payload: { msg: error.response.data.msg }});
      }
    }
    clearAlert();
  };

  const toggleSideBar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const handleInputChange = ({ name, value}) => {
    dispatch({ type: HANDLE_INPUT_CHANGE, payload: { name, value }})
  };

  const clearInputFields = () => {
    dispatch({ type: CLEAR_INPUT_FIELDS });
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_INPUT_FIELDS });
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({ type: CREATE_JOB_ERROR, payload: {msg: error.response.data.msg }});
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { search, searchStatus, searchType, sort, page } = state;
    let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}&page=${page}`;

    if (search) {
      url = url + `&search=${search}`
    }

    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch.get(url);
      const { jobs, numOfPages, totalJobs } = data;
      dispatch({ type: GET_JOBS_SUCCESS, payload: { jobs, numOfPages, totalJobs }});
    } catch (error) {
      // console.log(error);
      logoutUser();
    }
    clearAlert();
  };

  // useEffect(() => {
  //   getJobs();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const setEditJob = (_id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { _id }});
  };

  const editJob = async (_id) => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${_id}`, {
        position,
        company,
        jobLocation,
        jobType,
        status
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_INPUT_FIELDS });
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({ type: EDIT_JOB_ERROR, payload: {msg: error.response.data.msg }});
    }
    clearAlert();
  };

  const deleteJob = async (_id) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${_id}`);
      getJobs();
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({ type: DELETE_JOB_ERROR, payload: {msg: error.response.data.msg }});
    }
    clearAlert();
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch.get('/jobs/stats');
      const { defaultStats, monthlyApplications } = data;
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: { stats: defaultStats, monthlyApplications }
      });
    } catch (error) {
      // console.log(error.response);
      logoutUser();
    }
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page }});
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        registerUser,
        loginUser,
        toggleSideBar,
        logoutUser,
        updateUser,
        handleInputChange,
        clearInputFields,
        createJob,
        getJobs,
        setEditJob,
        editJob,
        deleteJob,
        showStats,
        clearFilters,
        changePage
      }}>
      { children }
    </AppContext.Provider>
  )
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
