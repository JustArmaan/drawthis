import { createContext, useContext, useState } from "react";

const DnDContext = createContext<[any, React.Dispatch<React.SetStateAction<any>>]>([null, () => {}]); // stupid library gave me this

import { ReactNode } from "react";

export const DnDProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
