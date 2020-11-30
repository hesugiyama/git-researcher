import React, { useState, useEffect, FormEvent } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from 'react-router-dom'

import api from "../../services/api";

import logoImg from "../../assets/logo.svg";

import { Title, Form, Repositories, Error } from "./styles";

interface Repository_Interface {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [typedRepository, setTypedRepository] = useState("");
  const [inputError, setInputError] = useState("");

  const [repositories, setRepositories] = useState<Repository_Interface[]>(() => {
    const storagedRepositories = localStorage.getItem('@GitResearcher: repositories');
    if(storagedRepositories) {
      return JSON.parse(storagedRepositories);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('@GitResearcher: repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!typedRepository) {
      setInputError("Type author/name of repository");
      return;
    }
    try {
      const response = await api.get<Repository_Interface>(`repos/${typedRepository}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setTypedRepository("");
      setInputError('');
    } catch (error) {
      setInputError('Erro to search the repository');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github researcher" />
      <Title>Search repositories on GitHub</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={typedRepository}
          onChange={(e) => setTypedRepository(e.target.value)}
          placeholder="Type the author/name of the repository"
        />
        <button type="submit">Search</button>
      </Form>

      {inputError && (<Error>{inputError}</Error>)}

      <Repositories>
        {repositories.map((repository) => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
