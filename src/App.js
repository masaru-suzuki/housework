import React, { useState, useEffect } from 'react'
import firebase from './firebase'
import './App.css'
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom'
import Auth from './auth/Auth'
//screens
import Home from './screens/Home'
import EditFamily from './screens/EditFamily'
import EditHouseworkList from './screens/EditHouseworkList'
import Profile from './screens/Member'
import SignInOrUp from './screens/SignInOrUp'
import SignUp from './screens/SignUp'
import Member from './screens/Member'
import EditMember from './screens/EditMember'

//comberListMocにisEditを入れて、このidEditを変更したら、firebaseに登録して、isEditをfalseにすればいいのかな？
const db = firebase.firestore()
const familyRef = db.collection('family').doc('u9EnmX300LQsunRawSUwwrhEVhS2').collection('member')
const houseworkRef = db.collection('family').doc('u9EnmX300LQsunRawSUwwrhEVhS2').collection('housework')

const makeListFromCollection = (querySnapshot) => {
  const list = []
  querySnapshot.forEach((res) => {
    const data = res.data()
    list.push({ id: res.id, ...data })
  })
  return list
}
// firebaseからdetaを取得
const App = () => {
  const [membersInfo, setMembersInfo] = useState([])
  const [houseworkListInfo, setHouseworkListInfo] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const history = useHistory()

  //firebaseの情報を取得
  const getFirestoreMock = async (firestoreRef, stateSetter) => {
    // console.log('getting data ...')
    const data = makeListFromCollection(await firestoreRef.get())
    stateSetter(data.filter((v) => typeof v.name === 'string'))
    //firebaseが更新された時に、再レンダリングするように、isEditをセット
    setIsEdit(false)
  }

  const getFirestoreRef = (targetRef) =>
    targetRef === 'family'
      ? familyRef
      : targetRef === 'housework'
      ? houseworkRef
      : console.log('firestore ref is undefined!')
  /**
   * firebase update task (EditMember , EditHouseworkで使う)
   * data : submitボタンを押した際に渡ってくるデータ member,housework
   * updateTarget : 変更する要素 id, name,birth ,earnedPoint
   * firestoreRef : firestoreのref familyRef, houseworkRef
   */
  const updateFirestore = (data, targetRef, updateTarget) => {
    //登録するRefの判定
    let firestoreRef = getFirestoreRef(targetRef)
    const targetId = data.id
    //登録するdataを生成
    const dataArr = updateTarget.map((target) => ({ [target]: data[target] }))
    //updateTargetListは配列の中にobjectが複数入っている
    //TODO updateTargetListの型をfirestoreと合わせる(object同士を都合する)
    const updateData = Object.assign(...dataArr)
    // console.log({ updateData })
    firestoreRef.doc(targetId).set(updateData, { merge: true })
    setIsEdit(true) //isEditで再レンダリングを発火させる
  }

  //firestoreに新しいメンバー情報を登録する
  const addMemberToFirestore = (member) => {
    familyRef.add(member)
    setIsEdit(true) //isEditで再レンダリングを発火させる
  }

  //firestoreのメンバーの削除
  const deleteFirestoreMember = (id) => {
    console.log('delete member', { id })
    familyRef
      .doc(id)
      .delete()
      .then(() => {
        console.log(`id=#{id}を削除しました。`)
        setIsEdit(true) //isEditで再レンダリングを発火させる
      })
      .catch((error) => {
        console.error('Error removeing document: ', error)
      })
  }

  const addFirestore = (data, targetRef) => {
    const firestoreRef = getFirestoreRef(targetRef)
    firestoreRef.add(data)
    setIsEdit(true) //isEditで再レンダリングを発火させる
  }

  useEffect(() => {
    //submitがclickされるたびにfirestoreのデータを引っ張ってきて更新する
    getFirestoreMock(familyRef, setMembersInfo)
    getFirestoreMock(houseworkRef, setHouseworkListInfo)
  }, [isEdit])

  //画面遷移
  const handleHome = () => {
    console.log('move to Home')
    history.push({ pathname: '/' })
  }
  const handleEditFamily = () => {
    console.log('move to EditFamily')
    history.push({ pathname: '/EditFamily' })
  }
  //今度はrecomposeのlibraryを使ってpropsを渡すのに挑戦してみる
  return (
    <Router>
      <Switch>
        <Route exact path="/signin" component={SignInOrUp} />
        <Route exact path="/signup" component={SignUp} />
        {/* 以下認証のみ */}
        <Auth>
          <Switch>
            <Route exact path="/" render={() => <Home membersInfo={membersInfo} />} />
            <Route exact path="/profile" component={Profile} />
            <Route
              exact
              path="/EditFamily"
              render={() => (
                <EditFamily
                  membersInfo={membersInfo}
                  handleEditFamily={handleEditFamily}
                  handleHome={handleHome}
                  updateFirestore={updateFirestore}
                  addFirestore={addFirestore}
                  deleteFirestoreMember={deleteFirestoreMember}
                />
              )}
            />
            <Route
              exact
              path="/EditHouseworkList"
              render={() => (
                <EditHouseworkList
                  houseworkListInfo={houseworkListInfo}
                  addFirestore={addFirestore}
                  // updateFirestoreOfHouseworkInfo={updateFirestoreOfHouseworkInfo}
                  updateFirestore={updateFirestore}
                />
              )}
            />
            <Route exact path="/Member" component={Member} />
            <Route exact path="/EditMember" render={() => <EditMember membersInfo={membersInfo} />} />
            {/* AddMemberは必要？ */}
            <Route render={() => <p>not found.</p>} />
          </Switch>
        </Auth>
      </Switch>
    </Router>
  )
}

export default App
