import React, { createContext, useReducer } from "react";
import axios from "axios";

interface IActions {
  type: string;
  payload: any;
}

interface Note {
  content: string;
  createdon: string;
}

interface Notes {
  notes: Note[];
}

const initialState: Notes = {
  notes: [],
};

export const NoteContext = createContext<Notes | any>(initialState);

const noteReducer: React.Reducer<Notes, any> = (
  state: Notes,
  action: IActions
) => {
  switch (action.type) {
    case "GET_NOTES":
      return {
        notes: action.payload,
      };
    case "ADD_NOTE":
      return {
        notes: [...state.notes, action.payload],
      };
    default:
      return state;
  }
};

const NoteProvider: React.FC = ({ children }) => {
  const [noteState, dispatch] = useReducer(noteReducer, initialState);

  const getNotes = async () => {
    try {
      const res = await axios.get("/api/notes");

      dispatch({ type: "GET_NOTES", payload: res.data });
    } catch (error) {
      return console.log(error);
    }
  };

  const addNote = async (data: Note) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post("/api/notes", data, config);

      dispatch({ type: "ADD_NOTE", payload: data });
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <NoteContext.Provider value={{ getNotes, noteState, addNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteProvider;
