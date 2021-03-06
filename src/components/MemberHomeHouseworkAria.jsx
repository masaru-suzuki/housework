import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
  },
  no_data: {
    width: '100%',
    padding: '24px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    margin: 'auto',
  },
  list_item_finished: {
    //TODO onFocusの時にline-throughが適用されなくなるから適用されるようにする
    // textDecoration: 'line-through', //逆にみづらいからけした
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '4fr 1fr 50px',
  },
  list_item: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '4fr 1fr 50px',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}))

const MemberHomeHouseworkAria = ({ houseworkListInfo, memberInfo, toggleBudge }) => {
  const classes = useStyles()
  const { id } = memberInfo

  if (houseworkListInfo.length === 0) {
    return (
      <div className={classes.no_data}>
        <p>家事が登録されていません。</p>
        <p>設定画面で家事を登録してください。</p>
      </div>
    )
  } else {
    return (
      <List className={classes.root} subheader={<li />}>
        {houseworkListInfo.map((housework) => {
          const labelId = `checkbox-list-secondary-label-${housework.id}`
          const { doneMemberId, isDone } = housework
          const isMatchDoneMember = isDone && id !== doneMemberId
          return (
            <ListItem
              key={housework.id}
              divider
              role={undefined}
              disabled={isMatchDoneMember}
              dense
              button
              className={isDone ? classes.list_item_finished : classes.list_item}
              onClick={() => toggleBudge(housework)}
            >
              <ListItemText id={labelId} primary={housework.name} />
              <ListItemText id={labelId} primary={`${housework.earnedPoint}point`} />
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={housework.isDone}
                  tabIndex={-1}
                  icon={<CheckCircleOutlineIcon fontSize="large" />}
                  checkedIcon={<CheckCircleIcon fontSize="large" />}
                  disableRipple
                  color="primary"
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
            </ListItem>
          )
        })}
      </List>
    )
  }
}

export default MemberHomeHouseworkAria
