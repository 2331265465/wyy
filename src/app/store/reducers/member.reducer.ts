import {Action, createReducer, on} from "@ngrx/store";
import {SetModalVisible,SetModalType} from "../actions/member.actions"

export enum ModalTypes  {
  Register = "Register",
  LoginByPhone = "LoginByPhone",
  Share = "Share",
  Like = "Like",
  Default = "Default"
}

export type MemberState = {
  modalVisible:boolean
  modalType:ModalTypes
}
export const initialState:MemberState = {
  modalVisible:false,
  modalType:ModalTypes.Default
}

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, {modalVisible}) => ({...state, modalVisible})),
  on(SetModalType, (state, {modalType}) => ({...state, modalType})),
)

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action)
}

