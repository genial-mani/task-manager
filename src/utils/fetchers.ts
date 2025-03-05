
export async function fetchtasks(): Promise<Response> {
  try {
    const response = await fetch(
      `/api/tasks`,
      {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching task:",error);
    const errorResponse = new Response(JSON.stringify({error: "Sever error fetching task."}),{
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return errorResponse;
  }
}


  export async function getTask(id: string): Promise<Response>{
    try {
      const response = await fetch(`/api/tasks/${id}`,{
        method: 'GET',
        credentials: "include",
      });
      return response;
    } catch (error) {
      console.error("Error fetching task:",error);
      const errorResponse = new Response(JSON.stringify({error: "Sever error fetching task."}),{
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return errorResponse;
    }
  }

  export async function completeTask(taskId: string): Promise<Response>{
    try {
      const response = await fetch(`/api/tasks/${taskId}`,{
        method: "PATCH",
        credentials: 'include',
      })
      return response;
    } catch (error) {
      console.error("Error completing task:",error);
      const errorResponse = new Response(
        JSON.stringify({ error: 'An error occurred' }),
        {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return errorResponse;
    }
  }

  export async function getDashboardStats(): Promise<Response>{
    try {
      const response = await fetch(`/api/tasks/dashboard`,{
        method: "GET",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        }
      })

      return response;
    } catch (error) {
      console.error("Error completing task:",error);
      const errorResponse = new Response(
        JSON.stringify({ error: 'An error occurred' }),
        {
          status: 500,
          statusText: 'Internal Server Error',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return errorResponse;
    }
  }
  