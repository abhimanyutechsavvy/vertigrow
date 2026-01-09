export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    return res.status(200).json({
      reply: "AI BACKEND IS ALIVE"
    });
  } catch (e) {
    return res.status(500).json({
      reply: "CRASH"
    });
  }
}
