export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(200).json({
        reply: "OPENAI KEY NOT FOUND"
      });
    }

    return res.status(200).json({
      reply: "OPENAI KEY FOUND AND READY"
    });
  } catch (e) {
    return res.status(500).json({
      reply: "CRASH"
    });
  }
}
