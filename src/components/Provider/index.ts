import { HomeProvider, useHome } from './HomeProvider'
import { DeletedNoteProvider, useDeletedNote } from './TrashProvider'
import { PrivateNoteProvider, usePrivateNote } from './PrivateNoteProvider'
import { NoteEditProvider, useNoteEdit } from './NoteEditProvider'
import {
  DragProvider,
  useDrag,
  createDetectGestureItem,
  createDropableItem,
  useDrop,
} from './DragProvider'
import {
  ContentScrollProvider,
  useContentScroll,
} from './ContentScrollProvider'
import { TagManagerProvider, useTagManager } from './TagManagerProvider'

export {
  HomeProvider,
  DeletedNoteProvider,
  PrivateNoteProvider,
  NoteEditProvider,
  ContentScrollProvider,
  DragProvider,
  TagManagerProvider,
}

export {
  useDeletedNote,
  useHome,
  useNoteEdit,
  usePrivateNote,
  useDrag,
  useDrop,
  useContentScroll,
  useTagManager,
}

export { createDetectGestureItem, createDropableItem }
