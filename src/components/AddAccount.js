import {useState} from "react";
import {useNavigate} from "react-router-dom";
function AddAccount () {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [member, setMember] = useState();
    const [isAdmin, setIsAdmin] = useState(false);


    const handleAdd = async () => {
        const memberData = {
            member: member,
            email: email,
            password: password,
            authority: isAdmin ? 'M' : 'U',
        };

        const emailCheck = /^[a-z]+[a-z0-9]{5,19}$/g;
        const passwordCheck = /(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*]).{5,}/;
        const korean = /^[가-힣]+$/;
        const emailCheckResponse = await fetch(`http://localhost:8080/api/checkemail?email=${email}`);
        const isEmailDuplicate = await emailCheckResponse.json();


        if (email === "" || password === "" || member === "" || confirmPassword === "") {
            alert("공백란 확인 후 다시 작성해주세요.");
        } else if (!passwordCheck.test(password)) {
            alert("비밀번호는 5글자 이상이며, 특수문자를 하나 이상 포함해야 합니다.");
        } else if (password !== confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지않습니다");
        } else if (!emailCheck.test(email)) {
            alert("아이디는 영문자로 시작하는 6~20자 영문자 또는 숫자이어야 합니다.");
        } else if (!korean.test(member)) {
            alert("이름은 한글만 입력할 수 있습니다.");
        } else if (isEmailDuplicate) {
            alert("이미 사용 중인 아이디입니다. 다른 아이디를 선택해주세요.");
        } else {
            fetch(`http://localhost:8080/api/addMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(memberData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.success) {
                        console.log("User added successfully");
                        alert("사용자 정보가 성공적으로 등록되었습니다.");
                        navigate('/login')
                    } else {
                        console.error("Failed to add member");
                        console.error("Error message: " + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
            });
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleMemberChange = (event) => {
        setMember(event.target.value);
    }

    const handleIsAdminChange = (event) => {
        setIsAdmin(event.target.checked);
    }

    const handleClose = () => {
        navigate('/')
    }

    return (
        <>
            <div className="계정 추가">
                <div className="add-account-modal-content">
                    <div className="account-email">
                        <div className="id">
                            <div className="id-id">
                                아이디 :
                            </div>
                            <input
                                type="text"
                                className="input-email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="아이디를 입력하세요."
                            />
                        </div>

                        <div className="id">
                            <div className="pw">
                                비밀번호:
                            </div>

                            <input
                                type="password"
                                className="input-password"
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="비밀번호 입력"
                            />
                        </div>

                        <div className="id">
                            <div className="pwcf">
                                비밀번호 확인:
                            </div>
                            <input
                                type="password"
                                className="input-confirm-password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                placeholder="비밀번호 재입력"
                            />
                        </div>

                        <div className="id">
                            <div className="id-test">
                                이름:
                            </div>
                            <input
                                type="text"
                                className="input-member"
                                value={member}
                                onChange={handleMemberChange}
                                placeholder="이름 입력"
                            />
                        </div>

                        <div className="label-admin">
                            <div className="label-is-user">
                                <input
                                    type="checkbox"
                                    className="input-is-user"
                                    checked={!isAdmin}
                                    onChange={() => setIsAdmin(false)}
                                />
                                사용자
                            </div>
                            <div className="label-is-user">
                                <input
                                    type="checkbox"
                                    className="input-is-admin"
                                    checked={isAdmin}
                                    onChange={handleIsAdminChange}
                                />
                                관리자
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={handleClose}>
                            취소
                        </button>

                        <button className="add-button" onClick={handleAdd}>
                            만들기
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AddAccount;