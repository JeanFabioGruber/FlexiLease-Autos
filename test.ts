// Definindo o Schema do usuário
import mongoose, { Schema, Document, Model } from "mongoose";
import axios from "axios";

interface IUser extends Document {
  name: string;
  cpf: string;
  birth: Date;
  email: string;
  password: string;
  cep: string;
  address: {
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
  };
  qualified: string;
}

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  birth: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cep: { type: String, required: true },
  address: {
    logradouro: { type: String, default: "N/A" },
    complemento: { type: String, default: "N/A" },
    bairro: { type: String, default: "N/A" },
    localidade: { type: String, default: "N/A" },
    uf: { type: String, default: "N/A" },
  },
  qualified: { type: String, enum: ["sim", "não"], required: true },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/users", async (req, res) => {
  try {
    const { name, cpf, birth, email, password, cep, qualified } = req.body;

    if (!name || !cpf || !birth || !email || !password || !cep || !qualified) {
      return res.status(400).send("Todos os campos são obrigatórios.");
    }

    // Consulta o serviço ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    const address = response.data;

    // Verifica se o CEP é válido
    if (address.erro) {
      return res.status(400).send("CEP inválido.");
    }

    const newUser: IUser = new User({
      name,
      cpf,
      birth,
      email,
      password, // Aqui a senha não está hasheada, como solicitado
      cep,
      address: {
        logradouro: address.logradouro || "N/A",
        complemento: address.complemento || "N/A",
        bairro: address.bairro || "N/A",
        localidade: address.localidade || "N/A",
        uf: address.uf || "N/A",
      },
      qualified,
    });

    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("Usuário não encontrado.");
    res.send(user);
  } catch (error) {
    res.status(400).send("ID inválido.");
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).send("Usuário não encontrado.");
    res.send(user);
  } catch (error) {
    res.status(400).send("ID inválido.");
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("Usuário não encontrado.");
    res.send("Usuário deletado com sucesso.");
  } catch (error) {
    res.status(400).send("ID inválido.");
  }
});

app.post("/auth", async (req, res) => {
  res.status(400).send("Autenticação não implementada.");
});
