import Template from "../components/LoginAndSignup/Template.jsx";
import signupImg from "../assets/Images/signupImg.jpeg"

const Signup = () => {
    return(
        <Template
        title={"Join the millions learning to code with StudyNotion for free"}
        desc1={"Build skills for today, tomorrow and beyond."}
        desc2={"Education to future-proof your career."}
        image={signupImg}
        formtype={"signup"}
        />
    )
}

export default Signup;