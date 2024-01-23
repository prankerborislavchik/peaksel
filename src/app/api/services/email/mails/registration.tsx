import { Button } from "@react-email/button"
import { Heading } from "@react-email/heading"
import { Text } from '@react-email/text';
import { render } from '@react-email/render';
import BaseEmail from "./baseMail"

interface IRegistrationMailProps {
    activationToken?: string
}

const RegistrationMail = (props: IRegistrationMailProps) => {

    const { activationToken } = props

    return (
        <BaseEmail>
            <center>
                <Heading as="h3"
                    style={{ fontSize: "27px", marginTop: "0px" }}
                >
                    Приветствуем вас в нашем магазине!
                </Heading>
            </center>
            <Text style={{ fontSize: "24px" }}>
                Для подтверждения аккаунта перейдите по ссылке
            </Text>
            <center>
                <Button
                    href={`${process.env.BASE_URL}/registration-confirm/${activationToken}`}
                    style={{
                        fontSize: "18px",
                        background: "#37BD8D",
                        color: "#01579B",
                        borderRadius: "8px",
                        margin: "8px 0px 12px 0px"
                    }}
                >
                    <Text
                        style={
                            {
                                padding: "16px 28px",
                                margin: "0",
                                fontSize: "24px",
                                textDecoration: "underline dotted 0.5px"
                            }
                        }
                    >
                        Перейти
                    </Text>
                </Button>
            </center>
            <Text style={
                { fontSize: "18px", marginBottom: "27px" }
            }>
                Ваш выбор, ваше качество просмотра!
            </Text>
        </BaseEmail>
    )
}


const registrationMail = (props: IRegistrationMailProps) => render(<RegistrationMail {...props} />)

export { registrationMail }