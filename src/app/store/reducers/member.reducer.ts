import {Action, createReducer, on} from "@ngrx/store";
import {SetModalVisible,SetModalType,SetUserId, SetLikeId} from "../actions/member.actions"

export enum ModalTypes  {
  Register = "Register",
  LoginByPhone = "LoginByPhone",
  Share = "Share",
  Like = "Like",
  Default = "Default"
}

export type MemberState = {
  modalVisible:boolean
  modalType:ModalTypes,
  userId:string
  likeId:string
}
export const initialState:MemberState = {
  modalVisible:false,
  modalType:ModalTypes.Default,
  userId: '',
  likeId: ''
}

const reducer = createReducer(
  initialState,
  on(SetModalVisible, (state, {modalVisible}) => ({...state, modalVisible})),
  on(SetModalType, (state, {modalType}) => ({...state, modalType})),
  on(SetUserId, (state, {id}) => ({...state, userId:id})),
  on(SetLikeId, (state, {id}) => ({...state, likeId:id})),
)

export function memberReducer(state: MemberState, action: Action) {
  return reducer(state, action)
}

