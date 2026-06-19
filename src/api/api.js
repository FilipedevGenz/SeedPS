const API_URL = 'https://blog-api.seedabit.org.br/api';

const API_KEY = 'key-qxrrmif75j';

const apiRequest = {

  healthCheck: async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          statusText: response.statusText,
        };
      }
      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        status: 0,
        statusText: error.message,
      };
    }
  },

  getPosts: async () => {
    
    try {
      console.log("[getPosts]")
      const response = await fetch(`${API_URL}/posts`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      if (!response.ok) {
        console.error("error: fetch ", response.status, response.statusText)
        return {
          success: false,
          data: null,
          status: response.status,
          statusText: response.statusText,
        };
      }
      const data = await response.json();
     
      console.log("[getPosts]", data)
      
      return {
        success: true,
        data,
        status: response.status,
        statusText: response.statusText,
      };
      
    } catch (error) {
      console.error("error", error);

      return {
        success: false,
        data: null,
        status: 0,
        statusText: error.message,
      };
    }
  },

  createPost: async ({ title, content, author }) => {
    
    try {
      console.log("[createPost]", title, content, author)
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          title: title,
          content: content,
          author: author
        })
      });

      if (!response.ok) {
        return {
          success: false,
          data: null,
          status: response.status,
          statusText: response.statusText,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        status: response.status,
        statusText: response.statusText,
      };
      
    } catch (error) {
      console.error("[error]", error);

      return {
        success: false,
        data: null,
        status: 0,
        statusText: error.message,
      };
    }
  },

  deletePost: async (id) => {
    try {
      console.log("[deletePost]", id)
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json',
          'accept': '*/*'
        }
      });

      if (!response.ok) {
        return {
          success: false,
          data: null,
          status: response.status,
          statusText: response.statusText,
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        status: response.status,
        statusText: response.statusText,
      };
      
    } catch (error) {
      console.error("[error]", error);

      return {
        success: false,
        data: null,
        status: 0,
        statusText: error.message,
      };
    }
  },
}