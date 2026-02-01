import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Send,
    Copy,
    Cpu,
    Palette,
    Type,
    Disc,
    Film,
    BookOpen,
    Save,
    Trash2
} from 'lucide-react';
import { getIdeas, saveIdea, deleteIdea } from '../utils/storage';

const SYSTEM_PROMPT = `Eres el Director Creativo de ORVANN (Original Roots Visual Art Narrative Nostalgia).
Tu misión es curar momentos culturales y transformarlos en piezas de arte (Streetwear Premium).

MANIFIESTO ORVANN:
ORVANN no vende ropa, cura momentos. Intersección entre la calle y la galería.
Estética: Brutalismo 80ero, Nostalgia, Cinematic, High Contrast.
Colecciones: 
- CELLULOID (Cine: Tarantino, León, Fight Club).
- FANIA (Música: Salsa, Rock, Hip-Hop 90s).
- TYPEWRITER (Literatura: Bukowski, Gonzo).

TU TAREA:
Generar una idea de producto basada en el input.
Responde SOLO en formato JSON exacto sin markdown.

JSON Structure:
{
  "title": "Nombre corto y potente del producto",
  "quote": "Una frase corta o diálogo relacionado (para el diseño)",
  "description": "Explicación narrativa del concepto (Storytelling)",
  "visuals": "Descripción técnica del diseño gráfico (posición, estilo, colores)",
  "palette": ["#Hex1", "#Hex2", "#Hex3"],
  "nano_bana_prompt": "Prompt preciso para generar el mockup visual. Debe incluir: 'T-shirt design, flat lay, vintage texture, brutalism style' y los detalles visuales."
}`;

const StudioPage = () => {
    const [apiKey, setApiKey] = useState(localStorage.getItem('orvann_gemini_key') || '');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [savedIdeas, setSavedIdeas] = useState([]);
    const [showKeyInput, setShowKeyInput] = useState(!apiKey);

    useEffect(() => {
        setSavedIdeas(getIdeas());
    }, []);

    const handleSaveKey = () => {
        localStorage.setItem('orvann_gemini_key', apiKey);
        setShowKeyInput(false);
    };

    const generateIdea = async () => {
        if (!input.trim() || !apiKey) return;
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${SYSTEM_PROMPT}\n\nINPUT USUARIO: "${input}"`
                        }]
                    }]
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            const text = data.candidates[0].content.parts[0].text;
            // Clean markdown if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const json = JSON.parse(cleanText);
            setResult(json);
        } catch (error) {
            console.error(error);
            alert('Error generando idea: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveIdea = () => {
        if (!result) return;
        const saved = saveIdea({ ...result, query: input });
        setSavedIdeas([saved, ...savedIdeas.filter(i => i.id !== saved.id)]); // Optimistic update
        alert('Idea guardada en el Archivo.');
    };

    const handleDelete = (id) => {
        const remaining = deleteIdea(id);
        setSavedIdeas(remaining);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Prompt copiado');
    };

    return (
        <div className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-serif text-stone-50 mb-2 flex items-center gap-3">
                        <Sparkles className="text-amber-500" /> The Studio
                    </h1>
                    <p className="text-stone-500">Motor de Inteligencia Creativa ORVANN</p>
                </div>
                <button
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="text-xs text-stone-600 hover:text-amber-600 transition-colors"
                >
                    {showKeyInput ? 'Ocultar API Key' : 'Configurar API Key'}
                </button>
            </div>

            {/* API Key Input */}
            {showKeyInput && (
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl flex gap-4 items-center">
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Pegar Google Gemini API Key aquí..."
                        className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-4 py-2 text-stone-300 focus:border-amber-600 outline-none"
                    />
                    <button onClick={handleSaveKey} className="bg-stone-800 text-stone-300 px-4 py-2 rounded-lg hover:bg-stone-700">
                        Guardar
                    </button>
                </div>
            )}

            {/* Input Section */}
            <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Cpu size={120} />
                </div>

                <h2 className="text-lg font-bold text-stone-200 mb-4 font-serif">Inyectar Referencia Cultural</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateIdea()}
                        placeholder="Ej: 'Una camiseta sobre la soledad en Taxi Driver' o 'Canción Pedro Navaja'..."
                        className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-6 py-4 text-lg text-stone-100 placeholder-stone-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all"
                    />
                    <button
                        onClick={generateIdea}
                        disabled={loading}
                        className="bg-amber-600 hover:bg-amber-500 text-white px-8 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20"
                    >
                        {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div> : <Send size={20} />}
                        Generar
                    </button>
                </div>

                {/* Quick Prompts */}
                <div className="flex gap-3 mt-4">
                    <span className="text-xs text-stone-600 uppercase tracking-wider py-1">Inspiración:</span>
                    {['Cine Noir', 'Salsa Brava', 'Literatura Gonzo', 'Cyberpunk 80s', 'Arquitectura Brutalista'].map(tag => (
                        <button key={tag} onClick={() => setInput(tag)} className="text-xs bg-stone-800/50 text-stone-400 px-3 py-1 rounded-full hover:bg-stone-800 hover:text-amber-500 transition-colors">
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result Area */}
            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Visual Card (Mockup Logic) */}
                    <div className="bg-stone-200 text-stone-900 rounded-xl overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col">
                        <div className="absolute top-4 right-4 z-10">
                            <span className="bg-stone-900 text-white text-xs px-3 py-1 rounded-full uppercase tracking-widest font-bold">ORVANN PREVIEW</span>
                        </div>

                        {/* Mock T-Shirt Representation */}
                        <div className="flex-1 flex items-center justify-center p-12 bg-stone-300 relative">
                            {/* Shirt Base */}
                            <div className="w-full max-w-sm aspect-[3/4] bg-stone-100 shadow-xl rounded-2xl relative overflow-hidden flex flex-col relative group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')] opacity-10 mix-blend-multiply pointer-events-none"></div>

                                {/* Design Area */}
                                <div className="absolute top-[25%] left-[15%] right-[15%] bottom-[25%] border-2 border-dashed border-stone-300 flex items-center justify-center p-4">
                                    <div className="text-center space-y-4">
                                        <p className="font-serif font-black text-2xl uppercase leading-tight tracking-tighter" style={{ color: result.palette[0] || '#000' }}>
                                            {result.quote?.slice(0, 50)}
                                        </p>
                                        <div className="w-12 h-1 bg-stone-900 mx-auto"></div>
                                        <p className="font-mono text-xs text-stone-500 uppercase tracking-widest">
                                            {result.title}
                                        </p>
                                    </div>
                                </div>

                                {/* Brand Tag */}
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <p className="text-[10px] font-bold tracking-[0.3em] text-stone-400">ORVANN ARCHIVE</p>
                                </div>
                            </div>
                        </div>

                        {/* Palette Footer */}
                        <div className="bg-white p-4 flex justify-center gap-4">
                            {result.palette?.map((color, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => copyToClipboard(color)}>
                                    <div className="w-12 h-12 rounded-full shadow-inner border border-stone-100 transition-transform hover:scale-110" style={{ backgroundColor: color }}></div>
                                    <span className="text-[10px] font-mono text-stone-400 opacity-0 group-hover:opacity-100">{color}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data & Prompting */}
                    <div className="space-y-6">
                        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                            <h3 className="text-2xl font-serif text-amber-500 mb-2">{result.title}</h3>
                            <p className="text-stone-300 leading-relaxed mb-6">{result.description}</p>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                                        <Type size={14} /> Cita / Texto
                                    </h4>
                                    <p className="font-serif italic text-xl text-stone-400 border-l-2 border-amber-600/50 pl-4">
                                        "{result.quote}"
                                    </p>
                                </div>
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                                        <Palette size={14} /> Dirección de Arte
                                    </h4>
                                    <p className="text-sm text-stone-400 bg-stone-950/50 p-4 rounded-lg border border-stone-800">
                                        {result.visuals}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8 pt-6 border-t border-stone-800">
                                <button onClick={handleSaveIdea} className="flex-1 bg-stone-100 text-stone-900 py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2">
                                    <Save size={18} /> Guardar Idea
                                </button>
                            </div>
                        </div>

                        {/* Nano Bana Prompt */}
                        <div className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 border border-indigo-500/20 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-indigo-400 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles size={14} /> Nano Bana Prompt
                                </h4>
                                <button onClick={() => copyToClipboard(result.nano_bana_prompt)} className="text-xs text-indigo-400 hover:text-white flex items-center gap-1">
                                    <Copy size={12} /> Copiar
                                </button>
                            </div>
                            <code className="block bg-stone-950 p-4 rounded-lg text-xs text-stone-400 font-mono break-words leading-relaxed border border-stone-800">
                                {result.nano_bana_prompt}
                            </code>
                        </div>
                    </div>
                </div>
            )}

            {/* Saved Ideas (Gallery) */}
            {savedIdeas.length > 0 && (
                <div className="mt-16 border-t border-stone-800 pt-8">
                    <h3 className="text-xl font-serif text-stone-500 mb-6 flex items-center gap-2">
                        <BookOpen size={20} /> Archivo de Ideas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedIdeas.map(idea => (
                            <div key={idea.id} className="bg-stone-900 border border-stone-800 rounded-xl p-6 hover:border-amber-900/50 transition-colors group relative">
                                <button onClick={() => handleDelete(idea.id)} className="absolute top-4 right-4 text-stone-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={16} />
                                </button>
                                <h4 className="text-lg font-bold text-stone-200 mb-1">{idea.title}</h4>
                                <p className="text-xs text-amber-600 mb-3 uppercase tracking-wider">{idea.query}</p>
                                <p className="text-sm text-stone-400 line-clamp-3 mb-4">{idea.description}</p>
                                <div className="flex gap-2">
                                    {idea.palette?.map((c, i) => (
                                        <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }}></div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudioPage;
