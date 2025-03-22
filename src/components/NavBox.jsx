import styles from './styles/NavBox.module.css';

export default function NavBox(props) {
    return (
        <div onClick={props.navigate} className={`${styles.box} ${props.className}`}>
            <img src={props.img} />
            <p>{props.text}</p>
        </div>
    )
}