import { Heading } from "@react-email/heading";
import BaseEmail from "./baseMail";
import { render } from '@react-email/render'
import { Text } from "@react-email/text"
import { Button } from "@react-email/button";

interface IResetPasswordProps {
    resetToken: string
}

export const ResetPasswordMail = ({resetToken}: IResetPasswordProps) => {
    return (
        <BaseEmail>
            <center>
                <Heading
                    as="h3"
                    style={{ fontSize: "27px", marginTop: "0px" }}
                >
                    Восстановление пароля для входа в учётную запись
                </Heading>
            </center>
            <Text style={{ marginTop: "21px" }}>
                <Text
                    style={{
                        fontWeight: "600",
                        display: "inline",
                        margin: "0px",
                        fontSize: "21px",
                        color: "black"
                    }}
                >
                    Вы забыли пароль?
                </Text>&nbsp;<Text 
                    style={{fontSize: "21px", color: "#A5A5A5", display: "inline", margin: "0px" }}>
                    Не делитесь этим письмом с посторонними лицами!
                    Мошенники могут использовать данную ссылку для кражи ваших данных
                </Text>
            </Text>
            <center>
                <Button
                    href={`${process.env.BASE_URL}/recover-password/${resetToken}`}
                    style={{
                        background: "#37BD8D",
                        color: "#01579B",
                        borderRadius: "8px",
                        margin: "8px 0px 12px 0px"
                    }}
                >
                    <Text
                        style={{
                            padding: "16px 28px",
                            margin: "0",
                            fontSize: "21px",
                            textDecoration: "underline dotted 0.5px"
                        }}
                    >
                        Ваша уникальная ссылка для восстановления пароля
                    </Text>
                </Button>
            </center>
        </BaseEmail >
    )
}

const resetPasswordMail = (props: IResetPasswordProps) => render(<ResetPasswordMail {...props} />)

export { resetPasswordMail }