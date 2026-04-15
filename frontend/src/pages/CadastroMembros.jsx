import { useState, useEffect } from "react";
import { Users, UserPlus, QrCode, Baby, Users as UsersGroup, UserCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { QRCodeSVG } from "qrcode.react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface Membro {
  id: number;
  nome: string;
  idade: string;
  telefone: string;
  endereco: string;
  categoria: "crianca" | "jovem" | "irma" | "varao" | "geral";
  data: string;
}

export default function CadastroMembros() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("criancas");
  const [membros, setMembros] = useState<Membro[]>([]);
  
  // Estado para QR Codes de cada categoria
  const [qrCodeAtivo, setQrCodeAtivo] = useState<{ [key: string]: boolean }>({
    crianca: false,
    jovem: false,
    irma: false,
    varao: false,
    geral: false,
  });

  // Carregar membros do localStorage ao montar o componente
  useEffect(() => {
    carregarMembros();
  }, []);

  const carregarMembros = () => {
    const membrosStorage = localStorage.getItem("membros");
    if (membrosStorage) {
      setMembros(JSON.parse(membrosStorage));
    }
  };

  // Estados para formulários de cada categoria
  const [formCrianca, setFormCrianca] = useState({
    nome: "",
    idade: "",
    telefone: "",
    endereco: "",
  });

  const [formJovem, setFormJovem] = useState({
    nome: "",
    idade: "",
    telefone: "",
    endereco: "",
  });

  const [formIrma, setFormIrma] = useState({
    nome: "",
    idade: "",
    telefone: "",
    endereco: "",
  });

  const [formVarao, setFormVarao] = useState({
    nome: "",
    idade: "",
    telefone: "",
    endereco: "",
  });

  const [formGeral, setFormGeral] = useState({
    nome: "",
    idade: "",
    telefone: "",
    endereco: "",
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este membro?")) {
      const novosMembros = membros.filter((m) => m.id !== id);
      localStorage.setItem("membros", JSON.stringify(novosMembros));
      setMembros(novosMembros);
    }
  };

  const handleSubmit = (
    e: React.FormEvent,
    formData: typeof formCrianca,
    categoria: Membro["categoria"],
    setForm: React.Dispatch<React.SetStateAction<typeof formCrianca>>
  ) => {
    e.preventDefault();
    if (formData.nome && formData.idade && formData.telefone && formData.endereco) {
      const now = new Date();
      const dataFormatada = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      const novoMembro: Membro = {
        id: Date.now(),
        nome: formData.nome,
        idade: formData.idade,
        telefone: formData.telefone,
        endereco: formData.endereco,
        categoria,
        data: dataFormatada,
      };

      // Salvar no localStorage
      const novosMembros = [...membros, novoMembro];
      localStorage.setItem("membros", JSON.stringify(novosMembros));
      setMembros(novosMembros);

      // Limpar formulário
      setForm({ nome: "", idade: "", telefone: "", endereco: "" });

      // Mostrar mensagem de sucesso
      alert("Membro cadastrado com sucesso!");
    }
  };

  const toggleQRCode = (categoria: Membro["categoria"]) => {
    setQrCodeAtivo((prev) => ({
      ...prev,
      [categoria]: !prev[categoria],
    }));
  };

  const renderForm = (
    formData: typeof formCrianca,
    setFormData: React.Dispatch<React.SetStateAction<typeof formCrianca>>,
    categoria: Membro["categoria"],
    titulo: string,
    icon: React.ReactNode
  ) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Filtrar membros por categoria
    const membrosPorCategoria = membros.filter((m) => m.categoria === categoria);
    
    // Gerar dados do QR Code com todos os membros da categoria
    const qrData = JSON.stringify({
      categoria: categoria,
      total: membrosPorCategoria.length,
      membros: membrosPorCategoria.map((m) => ({
        id: m.id,
        nome: m.nome,
        idade: m.idade,
        telefone: m.telefone,
        endereco: m.endereco,
        data: m.data,
      })),
    });

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário - Lado Esquerdo */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              {icon}
              <h2 className="text-lg text-gray-900">{titulo}</h2>
            </div>

            <div className="mb-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
                <div className="text-sm text-red-700 mb-1">Total de {titulo.replace("Cadastro de ", "")}</div>
                <div className="text-3xl font-bold text-red-600">{membrosPorCategoria.length}</div>
              </div>
            </div>

            <form
              onSubmit={(e) => handleSubmit(e, formData, categoria, setFormData)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite o nome completo"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626] focus:ring-opacity-20 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Idade</label>
                <input
                  type="text"
                  name="idade"
                  value={formData.idade}
                  onChange={handleInputChange}
                  placeholder="Digite a idade"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626] focus:ring-opacity-20 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626] focus:ring-opacity-20 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Digite o endereço completo"
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#dc2626] focus:ring-2 focus:ring-[#dc2626] focus:ring-opacity-20 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 rounded-lg transition-colors font-medium"
              >
                Cadastrar {titulo.replace("Cadastro de ", "")}
              </button>
            </form>
          </div>

          {/* Lista de Membros - Lado Direito */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {icon}
                <h2 className="text-lg text-gray-900">{titulo.replace("Cadastro de ", "")} Cadastrados</h2>
              </div>
              <span className="text-sm text-gray-600">Total: {membrosPorCategoria.length}</span>
            </div>

            {membrosPorCategoria.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {icon}
                <p className="mt-3">Nenhum membro cadastrado ainda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left text-sm text-gray-700 pb-3 pt-3 px-4 font-semibold">Nome</th>
                      <th className="text-left text-sm text-gray-700 pb-3 pt-3 px-4 font-semibold">Idade</th>
                      <th className="text-left text-sm text-gray-700 pb-3 pt-3 px-4 font-semibold">Telefone</th>
                      <th className="text-left text-sm text-gray-700 pb-3 pt-3 px-4 font-semibold">Endereço</th>
                      <th className="text-left text-sm text-gray-700 pb-3 pt-3 px-4 font-semibold">Data</th>
                      <th className="text-left text-sm text-gray-700 pb-3 pt-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membrosPorCategoria.map((membro) => (
                      <tr
                        key={membro.id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm text-gray-900">{membro.nome}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{membro.idade}</td>
                        <td className="py-4 px-4 text-sm text-gray-900">{membro.telefone}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{membro.endereco}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{membro.data}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDelete(membro.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Remover membro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Seção de QR Code */}
        {membrosPorCategoria.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#dc2626]" />
                <h3 className="text-lg text-gray-900">Exportar Todos os Membros via QR Code</h3>
              </div>
              <button
                onClick={() => toggleQRCode(categoria)}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {qrCodeAtivo[categoria] ? "Ocultar QR Code" : "Gerar QR Code"}
              </button>
            </div>

            {qrCodeAtivo[categoria] && (
              <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCodeSVG value={qrData} size={250} level="H" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    QR Code com {membrosPorCategoria.length} {titulo.replace("Cadastro de ", "").toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Escaneie este código para importar todos os dados dos membros desta categoria
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#dc2626] px-4 py-2 rounded-lg font-semibold text-white">
              ADAG
            </div>
            <h1 className="text-lg text-gray-700">Sistema de Cadastro de Membros</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-white border-2 border-[#dc2626] hover:bg-red-50 text-[#dc2626] px-5 py-2 rounded-lg transition-colors"
            >
              Cadastrar Visitante
            </button>
            <button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2 rounded-lg transition-colors">
              Cadastrar Membro
            </button>
            <button
              onClick={() => navigate("/cadastro-nao-evangelico")}
              className="bg-white border-2 border-[#dc2626] hover:bg-red-50 text-[#dc2626] px-5 py-2 rounded-lg transition-colors"
            >
              Cadastrar Não Evangélico
            </button>
            <button
              onClick={() => navigate("/painel-pastor")}
              className="bg-white border-2 border-[#dc2626] hover:bg-red-50 text-[#dc2626] px-5 py-2 rounded-lg transition-colors"
            >
              Painel do Pastor
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 flex items-start justify-center bg-gray-50">
        <div className="w-full max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-white border border-gray-200 p-1 rounded-lg">
              <TabsTrigger
                value="criancas"
                className="data-[state=active]:bg-[#dc2626] data-[state=active]:text-white text-gray-700"
              >
                Crianças
              </TabsTrigger>
              <TabsTrigger
                value="jovens"
                className="data-[state=active]:bg-[#dc2626] data-[state=active]:text-white text-gray-700"
              >
                Jovens
              </TabsTrigger>
              <TabsTrigger
                value="irmas"
                className="data-[state=active]:bg-[#dc2626] data-[state=active]:text-white text-gray-700"
              >
                Irmãs
              </TabsTrigger>
              <TabsTrigger
                value="varoes"
                className="data-[state=active]:bg-[#dc2626] data-[state=active]:text-white text-gray-700"
              >
                Varões
              </TabsTrigger>
              <TabsTrigger
                value="geral"
                className="data-[state=active]:bg-[#dc2626] data-[state=active]:text-white text-gray-700"
              >
                Cadastro Geral
              </TabsTrigger>
            </TabsList>

            <TabsContent value="criancas">
              {renderForm(
                formCrianca,
                setFormCrianca,
                "crianca",
                "Cadastro de Crianças",
                <Baby className="w-5 h-5 text-[#dc2626]" />
              )}
            </TabsContent>

            <TabsContent value="jovens">
              {renderForm(
                formJovem,
                setFormJovem,
                "jovem",
                "Cadastro de Jovens",
                <UsersGroup className="w-5 h-5 text-[#dc2626]" />
              )}
            </TabsContent>

            <TabsContent value="irmas">
              {renderForm(
                formIrma,
                setFormIrma,
                "irma",
                "Cadastro de Irmãs",
                <UserCircle className="w-5 h-5 text-[#dc2626]" />
              )}
            </TabsContent>

            <TabsContent value="varoes">
              {renderForm(
                formVarao,
                setFormVarao,
                "varao",
                "Cadastro de Varões",
                <UserPlus className="w-5 h-5 text-[#dc2626]" />
              )}
            </TabsContent>

            <TabsContent value="geral">
              {renderForm(
                formGeral,
                setFormGeral,
                "geral",
                "Cadastro Geral",
                <Users className="w-5 h-5 text-[#dc2626]" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
