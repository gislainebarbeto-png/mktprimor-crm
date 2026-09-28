<?php
// Recebe uploads do CRM e guarda no servidor (em vez do Supabase Storage).
// Só aceita quem está logado no CRM (token de sessão do Supabase).
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const SUPA_URL = 'https://dloxddrdqsltuwdabwaq.supabase.co';
const SUPA_KEY = 'sb_publishable_ZAEE1Rt9yMMWVTNqcdEo6w_WNhPt29M';
const PASTA    = __DIR__ . '/arquivos';
const EXTS     = ['jpg','jpeg','png','gif','webp','avif','heic','heif','bmp','mp4','mov','m4v','webm','avi','mkv',
                  'mp3','wav','m4a','ogg','aac','pdf','doc','docx','xls','xlsx','ppt','pptx','txt','csv','json',
                  'zip','rar','7z','key','numbers','pages','ai','psd','eps','ttf','otf','woff','woff2'];

function sair($code, $dados) { http_response_code($code); echo json_encode($dados, JSON_UNESCAPED_UNICODE); exit; }

function usuario_ok($token) {
  if (!$token || strlen($token) > 4000) return false;
  $cache = sys_get_temp_dir() . '/crm_tok_' . hash('sha256', $token);
  if (is_file($cache) && time() - filemtime($cache) < 300) return true;
  $ch = curl_init(SUPA_URL . '/auth/v1/user');
  curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10,
    CURLOPT_HTTPHEADER => ['apikey: ' . SUPA_KEY, 'Authorization: Bearer ' . $token]]);
  curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($code === 200) { @touch($cache); return true; }
  return false;
}

function caminho_seguro($bucket, $path) {
  if (!preg_match('/^[a-z0-9-]{1,40}$/', $bucket)) return null;
  $path = ltrim((string)$path, '/');
  if ($path === '' || strlen($path) > 400) return null;
  if (!preg_match('#^[A-Za-z0-9._@+/-]+$#', $path)) return null;
  foreach (explode('/', $path) as $parte) {
    if ($parte === '' || $parte[0] === '.') return null;
  }
  $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
  if (!in_array($ext, EXTS, true)) return null;
  return PASTA . '/' . $bucket . '/' . $path;
}

$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
if (!$auth && function_exists('getallheaders')) {
  foreach (getallheaders() as $k => $v) if (strtolower($k) === 'authorization') $auth = $v;
}
$token = preg_replace('/^Bearer\s+/i', '', trim($auth));
if ($_SERVER['REQUEST_METHOD'] !== 'POST') sair(405, ['erro' => 'Use POST']);
if (!usuario_ok($token)) sair(401, ['erro' => 'Sessão inválida. Entre de novo no CRM.']);

$acao = $_GET['acao'] ?? '';

if ($acao === 'upload') {
  $destino = caminho_seguro($_POST['bucket'] ?? '', $_POST['path'] ?? '');
  if (!$destino) sair(400, ['erro' => 'Nome ou tipo de arquivo não permitido.']);
  if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $e = $_FILES['file']['error'] ?? -1;
    sair(400, ['erro' => ($e === UPLOAD_ERR_INI_SIZE || $e === UPLOAD_ERR_FORM_SIZE) ? 'Arquivo grande demais para o servidor.' : 'Falha no envio (código ' . $e . ').']);
  }
  if (is_file($destino) && ($_POST['upsert'] ?? '0') !== '1') sair(409, ['erro' => 'Já existe um arquivo com esse nome.']);
  if (!is_dir(dirname($destino)) && !mkdir(dirname($destino), 0755, true)) sair(500, ['erro' => 'Não consegui criar a pasta.']);
  if (!move_uploaded_file($_FILES['file']['tmp_name'], $destino)) sair(500, ['erro' => 'Não consegui salvar o arquivo.']);
  @chmod($destino, 0644);
  sair(200, ['path' => $_POST['path']]);
}

if ($acao === 'remover') {
  $corpo = json_decode(file_get_contents('php://input'), true) ?: [];
  $removidos = [];
  foreach ((array)($corpo['paths'] ?? []) as $p) {
    $alvo = caminho_seguro($corpo['bucket'] ?? '', $p);
    if ($alvo && is_file($alvo) && unlink($alvo)) $removidos[] = $p;
  }
  sair(200, ['removidos' => $removidos]);
}

sair(400, ['erro' => 'Ação desconhecida.']);
