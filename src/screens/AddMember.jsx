import React, { useState } from 'react'
// import { makeStyles } from '@material-ui/core/styles'
import { ListSubheader, List, Container } from '@material-ui/core'
import BackBtn from '../uikit/BackBtn'
import SubmitBtn from '../uikit/SubmitBtn'
import InputField from '../uikit/InputField'
// import { useHistory } from 'react-router-dom'

// const useStyles = makeStyles(() => ({
//   text_field: {
//     marginBottom: 16,
//   },
//   btn_back: {
//     marginTop: 8,
//     width: 30,
//     fontSize: 16,
//   },
// }))

const AddMember = ({ addMemberToFirestore, handleIsAdd, flag }) => {
  // const classes = useStyles()
  // const member = membersInfo[editMemberIndex]
  // const history = useHistory()
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')
  const id = 'testId'

  //InputFeildに渡すnameとbirth をstateで管理して、<SubmitBtn>に渡す
  //その際にfamiliIdとmemberIdを渡す
  //その情報をApp.jsxに持っていって、firebaseを更新する
  const handleChange = (event) => {
    const identificationName = event.target.name
    const value = event.target.value
    if (identificationName === 'name') {
      setName(value)
    } else if (identificationName === 'birth') {
      setBirth(value)
    }
  }
  // const handelbackEditFamily = () => {
  //   history.push('/EditFamily')
  // }
  // // console.log({member})
  // useEffect(() => {
  //   setName(member.name)
  //   setBirth(member.birth)
  // }, [])
  return (
    <Container>
      <BackBtn />
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader disableSticky component="div">
            家族追加
          </ListSubheader>
        }
        // className={classes.root}
      >
        <InputField required={true} identificationName="name" label="名前" value={name} handleChange={handleChange} />
        <InputField
          required={true}
          identificationName="birth"
          label="生年月日"
          value={birth}
          handleChange={handleChange}
        />
        <SubmitBtn
          value="登録する"
          id={id} //memberが存在しないのをどうしよう
          addMemberToFirestore={addMemberToFirestore}
          flag={flag}
          name={name}
          birth={birth}
          handleBackEditFamily={handleIsAdd}
        />
      </List>
    </Container>
  )
}

export default AddMember
