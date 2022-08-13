import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const Main = () => {
    const searchRepoRef = useRef(null);
    const [searchRepo, setSearchRepo] = useState('');
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        searchRepoRef.current.focus();

        const reposStorage = localStorage.getItem('repos');

        if (reposStorage) setRepositories(JSON.parse(reposStorage));
    }, []);

    useEffect(() => {
        if (repositories.length > 0) localStorage.setItem('repos', JSON.stringify(repositories));
    }, [repositories]);

    const handleChangeRepo = (evt) => {
        setSearchRepo(evt.target.value);
    }

    const handleSubmit = useCallback((evt) => {
        evt.preventDefault();

        const submit = async () => {
            setLoading(true);

            try {
                const hasRepo = repositories.find(repo => repo.name === searchRepo);

                if (!hasRepo) {
                    const resp = await api.get(`repos/${searchRepo}`);

                    const data = {
                        name: resp.data.full_name
                    }

                    setRepositories([...repositories, data]);
                }
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

    const handleDelete = useCallback((repo) => {
        const filteredRepos = repositories.filter(r => r.name !== repo.name);
        setRepositories(filteredRepos);
    }, [repositories]);

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                My Favorites Repositories
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

            <List>
                {repositories.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton>
                                <FaTrash size={14} onClick={() => handleDelete(repo)} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorie/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    )
};

export default Main;