import { FC, ReactNode } from "react"
import { Html } from '@react-email/html'
import { Row } from '@react-email/row'
import {Column} from '@react-email/column'
import {Container} from "@react-email/container"
import { Heading } from "@react-email/heading"
import { Button } from "@react-email/button" 
import { Text } from "@react-email/text"

interface IBaseEmailProps {
    children: ReactNode
}

const BaseEmail: FC<IBaseEmailProps> = (props) => {

    const { children } = props

    // Ну +- нормальные шрифты, остальное залупа как будто
    // font-family: Arial, Helvetica, sans-serif;
    // font-family: 'MS Sans Serif', Geneva, sans-serif;
    // font-family: Tahoma, Geneva, sans-serif;
    // font-family: Verdana, Geneva, sans-serif;

    return (
        <Html>
            <table
                style={{ fontFamily: "Arial, Helvetica, sans-serif", width: "100%", color: "#1C1C1C" }}
                cellSpacing={0}
            >
                <tbody>
                    <Row style={{ background: "#37BD8D" }}>
                        <Column>
                            <center>
                                <Container style={{ padding: "20px 0px" }}>
                                    <center>
                                        <Heading as="h2" style={{ fontSize: "32px" }}>
                                            <Button
                                                href={process.env.BASE_URL}
                                                style={{ display: "inline-block", color: "white" }}
                                            >
                                                PEAKSEL
                                            </Button>
                                        </Heading>
                                    </center>
                                </Container>
                            </center>
                        </Column>
                    </Row>
                    <Row style={{ background: "#F8F4FF", padding: "40px 0px" }}>
                        <Column>
                            <center>
                                <Container style={{ maxWidth: "600px" }}>
                                    {children}
                                    <Text style={{ fontSize: "21px", marginBottom: "0px" }}>
                                        Ваш надёжный помощник в покупке телевизоров,
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: "24px",
                                            marginTop: "0px",
                                            marginBottom: "0px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Пиксель
                                    </Text>
                                </Container>
                            </center>

                        </Column>
                    </Row>
                    <Row style={{ background: "#37BD8D", padding: "20px 0px" }}>
                        <Column>
                            <center>
                                <Container>
                                    <center>
                                        <Text style={{ color: "white", fontSize: "18px" }}>
                                            ©2023 <Button
                                                href={process.env.BASE_URL}
                                                style={{ color: "#01579B" }}
                                            >
                                                Пиксель
                                            </Button>.
                                            Все права защищены.
                                        </Text>
                                    </center>
                                </Container>
                            </center>
                        </Column>
                    </Row>
                </tbody>
            </table>
        </Html>
    )
}

export default BaseEmail