import React, { createContext, useReducer } from "react";
import axios from "axios";
import { act } from "react-dom/test-utils";

interface IActions {
  type: string;
  payload: any;
}

interface Note {
  nid: number;
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
        ...state,
      };
    case "DELETE_NOTE":
      return {
        notes: state.notes.filter((note) => note.nid != action.payload),
      };
    case "EDIT_NOTE":
      return {
        notes: state.notes.map((note) => {
          if (note.nid === action.payload.id) {
            note.content = action.payload.note;
            return note;
          } else {
            return note;
          }
        }),
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

      dispatch({ type: "ADD_NOTE", payload: "" });
      getNotes();
    } catch (error) {
      return console.log(error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const res = await axios.delete(`/api/notes/${id}`);

      dispatch({ type: "DELETE_NOTE", payload: id });
    } catch (error) {
      return console.log("error");
    }
  };

  const editNote = async (id: number, note: string) => {
    try {
      const res = await axios.put(`/api/notes/${id}`, { note });

      dispatch({ type: "EDIT_NOTE", payload: { id, note } });
    } catch (error) {
      return console.log(error);
    }
  };

  return (
    <NoteContext.Provider
      value={{ getNotes, noteState, addNote, deleteNote, editNote }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NoteProvider;
