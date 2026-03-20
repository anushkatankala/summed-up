import { Highlight, Note } from "@/lib/types";

type AppStore = {
  indexId: string | null;
  lectureTitle: string;
  lectureUrl: string;
  notes: Note[];
  highlights: Highlight[];
};

const store: AppStore = {
  indexId: null,
  lectureTitle: "",
  lectureUrl: "",
  notes: [],
  highlights: [],
};

export function getStore() {
  return store;
}

export function setIndexData(input: {
  indexId: string;
  lectureTitle: string;
  lectureUrl: string;
}) {
  store.indexId = input.indexId;
  store.lectureTitle = input.lectureTitle;
  store.lectureUrl = input.lectureUrl;
}

export function setHighlights(highlights: Highlight[]) {
  store.highlights = highlights;
}

export function addNote(note: Note) {
  store.notes = [note, ...store.notes];
}
