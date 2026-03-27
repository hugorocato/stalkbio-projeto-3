import { ApifyClient } from 'apify-client';
import * as dotenv from 'dotenv';
import path from 'path';

// Configuração segura do ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Método não permitido' }) };

  try {
    if (!event.body) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Corpo vazio' }) };
    
    const { username } = JSON.parse(event.body);
    if (!username) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Username obrigatório' }) };

    const token = process.env.APIFY_TOKEN;

    if (!token) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Erro crítico: Token não configurado." }) };
    }

    const client = new ApifyClient({ token });

    console.log(`🔎 Buscando: ${username}...`);

    const run = await client.actor("zuzka/instagram-profile-scraper").call({
      usernames: [username], 
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    const dadosBrutos = items[0];

    if (!dadosBrutos || dadosBrutos.error) {
      return { 
        statusCode: 404, 
        headers, 
        body: JSON.stringify({ error: 'Perfil não encontrado ou bloqueado.' }) 
      };
    }

    // Prepara os dados iniciais
    const dadosTratados = {
        followersCount: dadosBrutos.followersCount || dadosBrutos.followers || 0,
        followsCount: dadosBrutos.followsCount || dadosBrutos.following || 0,
        postsCount: dadosBrutos.postsCount || dadosBrutos.posts || 0,
        profilePicUrl: dadosBrutos.profilePicUrl || dadosBrutos.profilePic || dadosBrutos.hdProfilePicUrlInput,
        fullName: dadosBrutos.fullName || dadosBrutos.username,
        username: dadosBrutos.username || username,
        biography: dadosBrutos.biography || "Sem biografia",
        isPrivate: dadosBrutos.isPrivate || false
    };

    // --- A MÁGICA ACONTECE AQUI (PROXY DE IMAGEM) ---
    // O servidor baixa a imagem e converte para Base64.
    // Assim, o navegador não precisa acessar o Instagram direto (que bloqueia).
    if (dadosTratados.profilePicUrl) {
        try {
            console.log("📸 Baixando imagem para converter em Base64...");
            const imgReq = await fetch(dadosTratados.profilePicUrl);
            
            if (imgReq.ok) {
                const arrayBuffer = await imgReq.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64Image = buffer.toString('base64');
                const contentType = imgReq.headers.get('content-type') || 'image/jpeg';
                
                // Substitui a URL original pela imagem "embutida"
                dadosTratados.profilePicUrl = `data:${contentType};base64,${base64Image}`;
                console.log("✅ Imagem convertida com sucesso!");
            }
        } catch (e) {
            console.error("⚠️ Falha ao converter imagem:", e.message);
            // Se falhar, mantém a URL original
        }
    }

    return { statusCode: 200, headers, body: JSON.stringify(dadosTratados) };

  } catch (error) {
    console.error('🔥 Erro:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};