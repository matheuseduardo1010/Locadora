CREATE DATABASE IF NOT EXISTS locadora_db;
USE locadora_db;

CREATE TABLE veiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(8) NOT NULL UNIQUE,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  ano INT NOT NULL,
  valor_diaria DECIMAL(10, 2) NOT NULL,
  status ENUM('disponivel', 'alugado') NOT NULL DEFAULT 'disponivel'
);

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  telefone VARCHAR(20)
);

CREATE TABLE locacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  veiculo_id INT NOT NULL,
  cliente_id INT NOT NULL,
  data_retirada DATE NOT NULL,
  data_prevista DATE NOT NULL,
  data_devolucao DATE NULL,
  valor_total DECIMAL(10, 2) NULL,
  status ENUM('ativa', 'finalizada') NOT NULL DEFAULT 'ativa',
  FOREIGN KEY (veiculo_id) REFERENCES veiculos(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

INSERT INTO veiculos (placa, marca, modelo, ano, valor_diaria) VALUES
('ABC1D23', 'Fiat', 'Mobi', 2022, 120.00),
('EFG4H56', 'Volkswagen', 'Gol', 2021, 110.00),
('IJK7L89', 'Chevrolet', 'Onix', 2023, 150.00);

INSERT INTO clientes (nome, cpf, telefone) VALUES
('Maria Souza', '123.456.789-00', '(16) 99999-0000');
