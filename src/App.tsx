import { useEffect, useState, useRef, FormEvent } from 'react'
import { FiTrash } from 'react-icons/fi'

import { api } from './services/api'

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean
  created_at: string;
}

// O ´.tsx' ou '.js' é porque é um componente criado dentro meu REACT, não apenas um simples arquivo
export default function App() {

  const [customers, setCustomers] = useState<CustomerProps[]>([])
  //Aqui dentro estão meus dados da lista

  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  //Quando eu coloco <alguma coisa>, significa que estou definindo o tipo 

  useEffect(() => {
    loadCustomers();
  }, [])
  //Se não exisitr nenhuma restrição dentro do meu colchetes, assim que o projeto for renderizado ele vai carregar o que tem dentro do UseEffect

  async function loadCustomers() {
    const response = await api.get("/customers")
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    //Quando coloco uma propriedade e : na frente significa que estou declarando o tipo dela, é possivel notar isso deixando o mouse encima dela
    event.preventDefault();

    if (!nameRef.current?.value || !emailRef.current?.value) return;

    const response = await api.post("/customer", {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    })

    setCustomers(allCustomers => [...allCustomers, response.data])
    //Estou trocando o valor que tenho na useState, pegando tudo o que tenho e jogando que tenho dentro do array e colocando o que eu cadastrei
    
    nameRef.current.value = "";
    emailRef.current.value = "";
  }

  async function handleDelete(id: string) {
    try{
      await api.delete("/customer", {
        params: {
          id: id
        }
      })

      const allCustomers = customers.filter( (customer) => customer.id !== id)
      setCustomers(allCustomers)

    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className="w-full min-h-screen bg-azul flex justify-center ">
      <div className='lg:flex lg:bg-branco lg:w-full lg:justify-center lg:max-w-[60em] lg:mr-10'> 
        <h1 className='text-azul lg:font-bold lg:text-[10em] lg:mt-48'>SGA</h1>
        <h3 className='text-azul lg:font-medium lg:text-[1.6em] lg:mt-96 absolute'>Sistema de Gestão Acadêmico</h3>
      </div>
      <main className="my-10 w-full md:max-w-2xl m-8">
        <h1 className="text-4xl font-medium text-branco md:-mx-3">Alunos</h1>

        <form onSubmit={handleSubmit} className="flex flex-col my-6">
          <label className="font-medium text-branco md:-mx-3 mt-5"> Nome: </label>
          <input
            type="text"
            placeholder="Digite o seu nome completo..."
            className="w-full mb-5 p-2 rounded md:-mx-3"
            ref={nameRef}
          //Quando eu acesso o nameRef, automaticamente eu estou verificando esse input todo
          />

          <label className="font-medium text-branco md:-mx-3"> Email: </label>
          <input
            type="email"
            placeholder="Digite o seu email completo..."
            className="w-full mb-5 p-2 rounded md:-mx-3"
            ref={emailRef}
          />

          <input
            type='submit'
            value='Cadastrar'
            className="cursor-pointer w-full p-2 bg-azulEscuro rounded font-medium text-branco hover:text-stone-200 duration-200 hover:bg-azulHover md:-mx-3 active:bg-brancoAzul"
          />
        </form>

        <section className="flex flex-col gap-4">
          {customers.map((customer) => (
            //O map vai percorrer todo meu array, esta customers.map pois o customers é meu array
            <article
              key={customer.id}
              className="w-full bg-branco rounded p-2 relative hover:scale-105 duration-200 md:-mx-3"
            >
              <p><span className="font-medium">Nome:</span>{customer.name}</p>
              <p><span className="font-medium">Email:</span> {customer.email}</p>
              <p><span className="font-medium">Status:</span> {customer.status ? "ATIVO" : "INATIVO"}</p>

              <button
                className='bg-vermelho w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2 hover:bg-vermelhoEscuro duration-200 active:bg-vermelhoClaro'
                onClick={() => handleDelete(customer.id)}
              >
                <FiTrash size={18} color='#fff' />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}