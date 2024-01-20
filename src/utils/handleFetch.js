const handleFetch = async (url, headers, method, body, onAction, toast) => {
    try {
        console.log(headers);
      const response = await fetch(url, { method, headers, body });
      const resObj = await response.json();
  
      if (response.ok) {
        toast({
          title: 'Success',
          description: resObj.message,
          status: 'success',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
        onAction();
      } else {
        toast({
          title: 'Failed',
          description: resObj.error,
          status: 'error',
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      }
  
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  
  export default handleFetch;
  