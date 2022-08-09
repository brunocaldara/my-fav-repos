import React from 'react';
import { FaGithub, FaPlus } from 'react-icons/fa';
import { Container, Form, SubmitButton } from './styles';

const Main = () => (
    <Container>
        <h1>
            <FaGithub size={25} />
            My Repositories
        </h1>

        <Form onSubmit={() => { }}>
            <input type='text' placeholder='Add Repo' />
            <SubmitButton>
                <FaPlus color='#FFF' size={14} />
            </SubmitButton>
        </Form>
    </Container>
);

export default Main;