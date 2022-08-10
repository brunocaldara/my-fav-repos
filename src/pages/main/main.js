import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';
import { Container, Form, SubmitButton } from './styles';
import api from '../../services/api';

const Main = () => {
    const searchRepoRef = useRef(null);
    const [searchRepo, setSearchRepo] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        searchRepoRef.current.focus();
    }, []);

    const handleChangeRepo = (evt) => {
        setSearchRepo(evt.target.value);
    }

    const handleSubmit = useCallback((evt) => {
        evt.preventDefault();

        const submit = async () => {
            setLoading(true);

            try {
                const resp = await api.get(`repos/${searchRepo}`);

                const data = {
                    name: resp.data.full_name
                }

                setRepositories([...repositories, data]);
                setSearchRepo('');
                searchRepoRef.current.focus();
            } catch (err) {
                setLoading(false);
                console.log(err)
            } finally {
                setLoading(false);
            }
        }

        submit();

    }, [searchRepo, repositories]);

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                My Repositories
            </h1>

            <Form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Add Repo'
                    value={searchRepo}
                    onChange={handleChangeRepo}
                    ref={searchRepoRef}
                />
                <SubmitButton
                    loading={loading ? 1 : 0}
                    length={searchRepo.length}
                >
                    {loading
                        ? (
                            <FaSpinner color='#FFF' size={14} />
                        )
                        : (
                            <FaPlus color='#FFF' size={14} />
                        )
                    }
                </SubmitButton>
            </Form>
        </Container>
    )
};

export default Main;