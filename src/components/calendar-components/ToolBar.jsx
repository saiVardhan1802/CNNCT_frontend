import React from 'react';
import styles from './styles/ToolBar.module.css';
import nextIcon from 'D:/Projects/Cuvette/CNNCT/CNNCT/src/assets/calendar/next.svg';
import prevIcon from 'D:/Projects/Cuvette/CNNCT/CNNCT/src/assets/calendar/prev.svg';


const ToolBar = ({ setView }) => {
  return (
    <div className={styles.container}>
      <div className={styles.navigateDates}>
        <div className={styles.prev}>
            <img src={prevIcon} alt="" />
        </div>
        <div className={styles.today}>
            <p>Today</p>
        </div>
        <div className={styles.next}>
            <img src={nextIcon} alt="" />
        </div>
      </div>
      <div className={styles.navigateViews}>
        <p onClick={() => setView("month")}>Month</p>
        <p onClick={() => setView("week")}>Week</p>
        <p onClick={() => setView("day")}>Day</p>
      </div>
      <div className={styles.searchBar}>
        search bar
      </div>
    </div>
  )
}

export default ToolBar
