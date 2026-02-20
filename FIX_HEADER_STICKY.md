# 🔧 FIX: Header y Filtros desaparecen bajo el Navbar

## ❌ PROBLEMA
Cuando haces scroll en una página con tabla (Productos, Pedidos, etc.), el título (h1) y la barra de filtros desaparecen bajo el navbar.

```
[NAVBAR - FIXED]                    ← z-index: 1000
├─────────────────────────────────
│ [HEADER h1 Productos]             ← Desaparece aquí al scrollear
│ [FILTROS - Input, Select]         ← Desaparece aquí al scrollear
│ [TABLA con datos]
│ ... mucho contenido ...
├─────────────────────────────────
```

## ✅ SOLUCIÓN
Agregar `position: sticky` al header y a los filtros para que se queden "pegados" mientras scrolleas.

```
[NAVBAR - FIXED, z-index: 1000]     ← Siempre visible
├─────────────────────────────────
│ [HEADER STICKY, z-index: 500]     ← Se queda visible bajo navbar
│ [FILTROS STICKY, z-index: 400]    ← Se queda visible bajo header
│ [TABLA con datos]
│ ... mucho contenido ...
└─────────────────────────────────
```

## 🎯 CAMBIOS REALIZADOS

### shared.css - .header

**Antes:**
```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 2rem;
}
```

**Después:**
```css
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
  gap: 2rem;
  
  /* NUEVO: Hacer el header sticky */
  position: sticky;
  top: var(--topbar-h);        /* Empieza debajo del navbar (70px) */
  background: #f3f4f6;         /* Color opaco para no ver contenido debajo */
  z-index: 500;                /* Encima de contenido pero debajo de navbar */
  padding: 2rem 0;             /* Espacio interno */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);  /* Línea divisoria */
}
```

**¿Qué hace cada propiedad?**
- `position: sticky` - El elemento se queda pegado al scrollear (dentro de su contenedor)
- `top: var(--topbar-h)` - Comienza a 70px del top (debajo del navbar)
- `background: #f3f4f6` - Color opaco para que no se vea el contenido debajo al scrollear
- `z-index: 500` - Encima de la tabla pero debajo del navbar
- `padding: 2rem 0` - Espacio interno para que el contenido no se toque con el borde

---

### shared.css - .filtros-bar

**Antes:**
```css
.filtros-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(251, 251, 251, 0.8);  /* Semi-transparente */
  backdrop-filter: blur(12px);
  padding: 1.5rem 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  gap: 1.5rem;
  flex-wrap: wrap;
}
```

**Después:**
```css
.filtros-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(251, 251, 251, 0.95);  /* Más opaco que antes */
  backdrop-filter: blur(12px);
  padding: 1.5rem 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  gap: 1.5rem;
  flex-wrap: wrap;
  
  /* NUEVO: Hacer el filtro sticky */
  position: sticky;
  top: calc(var(--topbar-h) + 6rem);  /* Debajo del header (~70px + ~96px) */
  z-index: 400;                        /* Encima de tabla pero debajo de header */
}
```

**¿Qué hace cada propiedad?**
- `position: sticky` - Igual al header, se queda pegado
- `top: calc(var(--topbar-h) + 6rem)` - Se posiciona debajo del header
  - `var(--topbar-h)` = 70px (navbar)
  - `6rem` ≈ 96px (altura aproximada del header)
  - Total: ~166px desde el top
- `z-index: 400` - Encima de todo el contenido pero debajo del header
- `background: 0.95` - Cambié de 0.8 a 0.95 para que sea más opaco

---

## 🎓 DIFERENCIA: position sticky vs fixed

| Aspecto | Fixed | Sticky |
|---------|-------|--------|
| Se queda pegado al viewport | ✅ Sí | ❌ Solo en su contenedor |
| Se mueve con el scroll | ❌ No | ✅ Hasta el límite del contenedor |
| Mejor para navbars | ✅ Sí | ❌ No |
| Mejor para headers dentro de contenido | ❌ No | ✅ Sí |

**Ejemplo visual:**
```
STICKY (nuestro caso):
[Navbar Fixed]
[Header Sticky - se queda aquí]
[Tabla scroll]
         ↓
[Navbar Fixed]
[Header Sticky - sigue aquí]
[Tabla scroll más]
         ↓
[Navbar Fixed]
[Header Sticky - sigue pegado]
[Tabla scroll al final]

FIXED (no lo queremos aquí):
Estaría por encima de todo siempre, bloqueando contenido
```

---

## 🧪 CÓMO PROBAR

1. Abre la app: `npm run dev`
2. Ve a **Productos** (o cualquier página con tabla)
3. Haz scroll poco a poco
4. Deberías ver:
   - ✅ El navbar permanece arriba
   - ✅ El header (título "Productos") se queda bajo el navbar
   - ✅ La barra de filtros se queda bajo el header
   - ✅ La tabla scrollea debajo sin cubrir el header

---

## 📊 JERARQUÍA DE Z-INDEX FINAL

```
z-index: 1000  → .navbar-top (navbar)
z-index: 999   → .sidebar-left (sidebar)
z-index: 500   → .header (sticky)
z-index: 400   → .filtros-bar (sticky)
z-index: auto  → Resto del contenido (tabla, cards, etc)
```

---

## 💡 NOTAS IMPORTANTES

1. **Sticky solo funciona dentro de su contenedor:**
   - El header está dentro de `.app-content`
   - Si scrolleas, se queda pegado DENTRO de `.app-content`
   - No interfiere con navbar o sidebar

2. **Top debe ser consistente:**
   - `.header { top: var(--topbar-h); }` 
   - Es importante que use la misma variable que el navbar

3. **Background es necesario:**
   - Sin `background: #f3f4f6;` verías la tabla de fondo
   - Sin seria "transparente" y se vería raro

4. **Backdrop-filter en .filtros-bar:**
   - Mantiene el efecto de vidrio (blur)
   - Pero ahora con background más opaco para mejor lectura

---

## 🚀 ALTERNATIVAS (si quieres personalizar más)

### Opción 1: Header con sombra dinámica
```css
.header {
  /* ... estilos anteriores ... */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0);
  transition: box-shadow 0.3s ease;
}

.header.scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

Necesitarías JavaScript para agregar la clase `.scrolled` al hacer scroll.

### Opción 2: Filtros sin sticky (si prefers que desaparezca)
```css
.filtros-bar {
  /* Quitar position: sticky; */
  position: static; /* o solo borrarlo */
}
```

### Opción 3: Header pegado sin movimiento (fixed en lugar de sticky)
```css
.header {
  position: fixed;
  top: var(--topbar-h);
  left: var(--sidebar-w);
  right: 0;
  width: calc(100% - var(--sidebar-w)); /* Ajustar por sidebar */
  z-index: 100; /* Más bajo para que navbar esté arriba */
}
```

Esto requería ajustar márgenes en el contenido, no es recomendado.

---

## ✨ RESUMEN

El fix es simple pero crucial para UX:
- ✅ Header y filtros permanecen siempre visibles
- ✅ El usuario siempre ve el contexto (título) al scrollear
- ✅ Sin interferir con navbar o sidebar
- ✅ Sin necesidad de JavaScript
- ✅ Funciona en móvil y desktop

¡Ahora es más fácil navegar por las tablas grandes! 🎉
