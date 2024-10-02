import axios from "axios";

const courseApi = axios.create({
  baseURL: import.meta.env.VITE_COURSE_SERVER_URL + "api",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_SERVER_URL}/`,
});
const learnerApi = axios.create({
  baseURL: `${import.meta.env.VITE_LEARNER_SERVER_URL}/`,
});
const feedbackApi = axios.create({
  baseURL: `${import.meta.env.VITE_FEEDBACK_SERVER_URL}/`,
});

export { courseApi, authApi, learnerApi, feedbackApi };
