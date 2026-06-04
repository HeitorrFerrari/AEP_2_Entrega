-- Seed categories
INSERT INTO categorias (tipo_categoria, descricao, identificacao_permitida) VALUES
  ('ILUMINACAO', 'Iluminação pública', 'ANONIMO'),
  ('BURACO', 'Buraco nas ruas', 'ANONIMO'),
  ('PODA', 'Podagem de árvores irregulares', 'ANONIMO'),
  ('SAUDE', 'Dúvidas ou solicitação relacionada à saúde', 'IDENTIFICADO'),
  ('LIMPEZA', 'Limpeza e zeladoria', 'ANONIMO'),
  ('OUTRO', 'Outro', 'ANONIMO');

-- Seed default attendant
INSERT INTO usuarios (nome, documento, cargo, criado_em) VALUES
  ('Atendente Padrão', '00000000000', 'FUNCIONARIO_PUBLICO', CURRENT_TIMESTAMP);
