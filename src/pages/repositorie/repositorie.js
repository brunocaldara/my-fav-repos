import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from "react-router-dom";
import {
    Container, Owner, Loading, BackButton, IssuesList, PageActions,
    IssuesFilterStatus, IssuesFilterStatusItem
} from './styles';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';

const Repositorie = ({ }) => {
    const [repositorie, setRepositorie] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [issuesStatus, setIssuesStatus] = useState('open');
    const [allButton, setAllButton] = useState(false);
    const [openButton, setOpenButton] = useState(true);
    const [closedButton, setClosedButton] = useState(false);
    const params = useParams();

    const repo = params.name;

    useEffect(() => {
        const load = async () => {
            const [respRepo, respIssues] = await Promise.all([
                api.get(`repos/${repo}`),
                api.get(`repos/${repo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }
                }),
            ]);

            setRepositorie(respRepo.data);
            setIssues(respIssues.data);
            setLoading(false);
        }

        load();

    }, [repo]);

    const loadIssues = useCallback(async () => {
        const respIssues = await api.get(`repos/${repo}/issues`, {
            params: {
                state: 'open',
                page,
                per_page: 5
            }
        });

        setIssues(respIssues.data);
    }, [page, repo]);

    useEffect(() => {
        loadIssues();
    }, [loadIssues]);

    const handlePage = (action) => {
        setPage(action === 'back' ? page - 1 : page + 1);
    }

    const loadIssuesByStatus = useCallback(async () => {
        const respIssues = await api.get(`repos/${repo}/issues`, {
            params: {
                state: issuesStatus,
                page,
                per_page: 5
            }
        });

        setIssues(respIssues.data);
    }, [page, repo, issuesStatus]);

    useEffect(() => {
        loadIssuesByStatus();
    }, [loadIssuesByStatus]);

    const handleStatus = (status) => {
        setIssuesStatus(status);
        setPage(1);

        switch (status) {
            case 'all':
                setAllButton(true);
                setOpenButton(false);
                setClosedButton(false);
                break;
            case 'open':
                setAllButton(false);
                setOpenButton(true);
                setClosedButton(false);
                break;
            case 'closed':
                setAllButton(false);
                setOpenButton(false);
                setClosedButton(true);
                break;
            default:
                break;
        }
    }

    if (loading) {
        return (
            <Loading>
                <h1>Loading...</h1>
            </Loading>
        );
    }

    return (
        <Container>
            <BackButton to='/'>
                <FaArrowLeft color='#0D2636' size={30} />
            </BackButton>
            <Owner>
                <img
                    src={repositorie.owner.avatar_url}
                    alt={repositorie.owner.login}
                />
                <h1>{repositorie.name}</h1>
                <p>{repositorie.description}</p>
            </Owner>

            <p>Filtrar Issues pelos Status:</p>
            <IssuesFilterStatus>
                <IssuesFilterStatusItem selected={allButton} onClick={() => handleStatus('all')}>
                    Todas
                </IssuesFilterStatusItem>
                <IssuesFilterStatusItem selected={openButton} onClick={() => handleStatus('open')}>
                    Abertas
                </IssuesFilterStatusItem>
                <IssuesFilterStatusItem selected={closedButton} onClick={() => handleStatus('closed')}>
                    Fechadas
                </IssuesFilterStatusItem>
            </IssuesFilterStatus>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>Usuário: {issue.user.login} {issuesStatus === 'all' && ('- Status: ' + issue.state)}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>

            <PageActions>
                <button
                    type='button'
                    onClick={() => handlePage('back')}
                    disabled={page < 2}
                >
                    Voltar
                </button>
                <button
                    type='button'
                    onClick={() => handlePage('next')}
                >
                    Próxima
                </button>
            </PageActions>
        </Container>
    );
};

export default Repositorie;