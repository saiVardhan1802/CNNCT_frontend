import React, { useState } from 'react';
import styles from './styles/ToolBar.module.css';
import nextIcon from '../../assets/calendar/next.svg';
import prevIcon from '../../assets/calendar/prev.svg';
import searchIcon from '../../assets/calendar/searchIcon.svg'

const ToolBar = ({ setView, view, date, setDate, searchQuery, HandleSearch, setSearchQuery }) => {
  const [searchValue, setSearchValue] = useState('');
  function HandlePrev() {
    if (view === 'month') return setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    if (view === 'week') return setDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
    if (view === 'day') return setDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
  }

  function HandleNext() {
    if (view === 'month') return setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    if (view === 'week') return setDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    if (view === 'day') return setDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Prevent form submission if wrapped in a form
      e.preventDefault();
      // console.log('Enter pressed! Value:', inputValue);
      // Add your action here
      setSearchQuery(searchValue);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.navigateDates}>
        <div onClick={HandlePrev} className={styles.prev}>
          <img src={prevIcon} alt="" />
        </div>
        <div onClick={() => setDate(new Date())} className={styles.today}>
          <p>Today</p>
        </div>
        <div onClick={HandleNext} className={styles.next}>
          <img src={nextIcon} alt="" />
        </div>
      </div>
      <div className={styles.navigateViews}>
        <div style={{
          // backgroundColor: view='month'? '#1877F2' : '',
          //color: view='month'? 'white' : 'gray'
        }}>
          <p onClick={() => setView("month")}>Month</p>
        </div>
        <div style={{
          // backgroundColor: view='week'? '#1877F2' : '',
          //color: view='week'? 'white' : 'gray'
        }} >
          <p onClick={() => setView("week")}>Week</p>
        </div>
        <div style={{
          // backgroundColor: view='day'? '#1877F2' : '',
          //color: view='day'? 'white' : 'gray'
        }} >
          <p onClick={() => setView("day")}>Day</p>
        </div>
      </div>
      <div className={styles.searchBar}>
        <img src={searchIcon} alt="" />
        <input onKeyDown={handleKeyDown} type="text" placeholder='Search' value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} />
      </div>
    </div>
  )
}

export default ToolBar
