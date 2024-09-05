import {useState ,createContext,useContext } from 'react'

const userContext =createContext(null);

export const UserProvider = ({ children }) => {
  //import useUserContext from './../../../UserContext';
  //const { name, setName } = useUserContext();
 // import { UserProvider } from './UserContext';
//<UserProvider>
//<App />
//</UserProvider>,
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
 


   



    return (
      <userContext.Provider value={[
        name,
        setName,
        email,
        setEmail, 
         ]}>
        {children}
      </userContext.Provider>
    );
  };

  const useUserContext = () => {
    const context = useContext(userContext);
    if (!context) {
      throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
  };


export default useUserContext

