import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL,
     withCredentials: true,
  headers: {
    "Content-Type":
      "application/json",
  },
});

api.interceptors.request.use(
  (config)=>{

    if(
      typeof window !== "undefined" &&
      !config.url.includes("/admin/auth/login")
    ){

      const token =
        localStorage.getItem(
          "admin_token"
        );


      if(token){

        config.headers.Authorization =
          `Bearer ${token}`;

      }

    }

    return config;

  }
);
export default api;