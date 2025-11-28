import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: '¿Qué es OportUNI?',
        a: 'OportUNI es la plataforma oficial de la Universidad Nacional de Ingeniería para centralizar todas las oportunidades académicas, profesionales y extracurriculares disponibles para estudiantes y egresados.'
      },
      {
        q: '¿Quién puede usar la plataforma?',
        a: 'La plataforma está disponible para todos los estudiantes y egresados de la UNI con correo institucional (@uni.pe). Las organizaciones externas también pueden solicitar acceso para publicar oportunidades.'
      },
      {
        q: '¿El uso de la plataforma tiene algún costo?',
        a: 'No, OportUNI es completamente gratuito para todos los usuarios de la comunidad UNI.'
      }
    ]
  },
  {
    category: 'Cuenta y Perfil',
    questions: [
      {
        q: '¿Cómo creo mi cuenta?',
        a: 'Puedes registrarte usando tu correo institucional @uni.pe. Solo necesitas proporcionar tu nombre, correo y crear una contraseña segura.'
      },
      {
        q: '¿Por qué debo completar mi perfil?',
        a: 'Un perfil completo aumenta tus posibilidades de ser seleccionado en las postulaciones. Los publicadores pueden ver tu información académica, habilidades e intereses para evaluar tu candidatura.'
      },
      {
        q: '¿Cómo subo mi CV?',
        a: 'En la sección "Mi Perfil" encontrarás la opción para subir tu CV en formato PDF (máximo 5MB). Te recomendamos mantenerlo actualizado.'
      }
    ]
  },
  {
    category: 'Postulaciones',
    questions: [
      {
        q: '¿Cómo postulo a una oportunidad?',
        a: 'Navega a la oportunidad de tu interés, revisa los requisitos y haz clic en "Postular". Puedes agregar una carta de presentación opcional para destacar tu candidatura.'
      },
      {
        q: '¿Puedo retirar mi postulación?',
        a: 'Sí, puedes retirar tu postulación mientras esté en estado "Pendiente" o "En revisión" desde la sección "Mis Postulaciones".'
      },
      {
        q: '¿Cómo sé si fui seleccionado?',
        a: 'Recibirás notificaciones cuando el estado de tu postulación cambie. También puedes revisar el estado actualizado en "Mis Postulaciones".'
      }
    ]
  },
  {
    category: 'Publicadores',
    questions: [
      {
        q: '¿Cómo publico una oportunidad?',
        a: 'Si tienes rol de publicador, ve a "Mis Publicaciones" y haz clic en "Nueva publicación". Completa el formulario con todos los detalles de la oportunidad.'
      },
      {
        q: '¿Cuánto tarda en aprobarse mi publicación?',
        a: 'Las publicaciones son revisadas por el equipo de OCBU en un plazo de 24-48 horas hábiles antes de ser visibles públicamente.'
      },
      {
        q: '¿Cómo gestiono las postulaciones recibidas?',
        a: 'En cada publicación encontrarás la opción "Ver postulaciones" donde podrás revisar candidatos, cambiar estados y exportar la información a Excel.'
      }
    ]
  }
];

export default function HelpPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container-app text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Centro de Ayuda</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más frecuentes sobre el uso de OportUNI
          </p>
        </div>
      </div>

      <div className="container-app py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-8">
            {faqs.map((category, catIndex) => (
              <div key={catIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">{category.category}</h2>
                </div>
                <div className="divide-y">
                  {category.questions.map((item, qIndex) => {
                    const itemId = `${catIndex}-${qIndex}`;
                    const isOpen = openItems.includes(itemId);

                    return (
                      <div key={qIndex}>
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 animate-fade-in">
                            <p className="text-gray-600">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Necesitas más ayuda?</h3>
              <p className="text-gray-600 mb-6">
                Si no encontraste la respuesta que buscabas, contáctanos directamente.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:ocbu@uni.edu.pe"
                  className="flex items-center text-gray-700 hover:text-primary-800"
                >
                  <Mail className="w-5 h-5 mr-3 text-primary-700" />
                  ocbu@uni.edu.pe
                </a>
                <a
                  href="tel:+5114820777"
                  className="flex items-center text-gray-700 hover:text-primary-800"
                >
                  <Phone className="w-5 h-5 mr-3 text-primary-700" />
                  (01) 482-0777
                </a>
                <div className="flex items-start text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-primary-700 flex-shrink-0 mt-0.5" />
                  <span>
                    Oficina Central de Bienestar Universitario<br />
                    Av. Túpac Amaru 210, Rímac
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">Horario de atención</h3>
              <p className="text-primary-700">
                Lunes a Viernes<br />
                8:00 am - 5:00 pm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
