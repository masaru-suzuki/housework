import React, { useState } from 'react'
import { Divider } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import BackBtn from '../uikit/BackBtn'
import MemberHomeMemberInfoAria from './MemberHomeMemberInfoAria'
import MemberHomeHouseworkAria from './MemberHomeHouseworkAria'

const useStyles = makeStyles({
  root: {
    display: 'grid',
    height: '100%',
    gridTemplateRows: '40px 10px 150px 10px 1fr',
    overflow: 'hidden',
  },
  btn_back: {
    margin: '8px 16px',
    width: 30,
    fontSize: 16,
  },
})
const ContentsArea = ({ memberInfo, houseworkListInfo, handleBackHome, handleFinishBtn }) => {
  const classes = useStyles()
  const [clickedHousework, setClikedHousework] = useState({})

  //TODO 同じポイントの家事もあるから、budgeのtoggleを別なものにする？ => id
  const toggleBudge = (housework) => {
    const { isDone, earnedPoint } = housework

    handleFinishBtn(housework) //housework状態を登録
    setClikedHousework(housework)
    // console.log({ housework })
  }

  return (
    <div className={classes.root}>
      <BackBtn className={classes.btn_back} handleBack={handleBackHome} />
      <Divider className={classes.divider} />
      <MemberHomeMemberInfoAria memberInfo={memberInfo} clickedHousework={clickedHousework} />
      <Divider className={classes.divider} />
      <MemberHomeHouseworkAria
        houseworkListInfo={houseworkListInfo}
        memberInfo={memberInfo}
        handleFinishBtn={handleFinishBtn}
        toggleBudge={toggleBudge}
      />
    </div>
  )
}

export default ContentsArea
