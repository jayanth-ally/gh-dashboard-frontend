import './user.css';

const UserCards = (props) => {
    const onUserClicked = () => {
        props.selectUser(props.id);
    }
    return <div className="dynamic-card hover-card mb-4 animated fadeIn rounded-corners position-relative background-white pointer user-card" style={{maxWidth:props.size,maxHeight:props.size}} onClick={onUserClicked}>
        <div className="avatar user-avatar">
            <img src={props.avatar} alt="User avatar" style={{width:props.imgSize,height:props.imgSize,borderRadius:'50%'}}/>
        </div>
        <div className="user-login">
            {props.login}
        </div>
    </div>
}

export default UserCards;