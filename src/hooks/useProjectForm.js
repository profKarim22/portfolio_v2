import { useState, useEffect } from 'react';

export function useProjectForm(initialData, onSubmit) {
  const [form, setForm] = useState({
    id: '',
    title: '',
    badge: '',
    domain: '',
    domainColor: '#38bdf8',
    description: '',
    featured: false,
    isFeatured: false,
    github: '',
    liveDemo: '',
    figmaLink: '',
    metrics: [{ label: '', value: '' }],
    highlights: [''],
    tech: [],
  });

  const [techInput, setTechInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id || '',
        title: initialData.title || '',
        badge: initialData.badge || '',
        domain: initialData.domain || '',
        domainColor: initialData.domainColor || '#38bdf8',
        description: initialData.description || '',
        featured: Boolean(initialData.featured || initialData.isFeatured),
        isFeatured: Boolean(initialData.featured || initialData.isFeatured),
        github: initialData.github || initialData.githubUrl || '',
        liveDemo: initialData.liveDemo || initialData.liveUrl || '',
        figmaLink: initialData.figmaLink || initialData.figmaUrl || '',
        metrics:
          Array.isArray(initialData.metrics) && initialData.metrics.length > 0
            ? initialData.metrics.map((m) => ({ label: m.label || '', value: m.value || '' }))
            : [{ label: '', value: '' }],
        highlights:
          Array.isArray(initialData.highlights) && initialData.highlights.length > 0
            ? initialData.highlights
            : [''],
        tech: Array.isArray(initialData.tech)
          ? initialData.tech
          : Array.isArray(initialData.techStack)
          ? initialData.techStack
          : [],
      });
    }
  }, [initialData]);

  const updateField = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'featured') updated.isFeatured = value;
      if (field === 'isFeatured') updated.featured = value;
      return updated;
    });
  };

  // Metrics handlers
  const addMetric = () => {
    setForm((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { label: '', value: '' }],
    }));
  };

  const updateMetric = (idx, field, val) => {
    setForm((prev) => {
      const metrics = [...prev.metrics];
      metrics[idx] = { ...metrics[idx], [field]: val };
      return { ...prev, metrics };
    });
  };

  const removeMetric = (idx) => {
    setForm((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== idx),
    }));
  };

  // Highlights handlers
  const addHighlight = () => {
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ''],
    }));
  };

  const updateHighlight = (idx, val) => {
    setForm((prev) => {
      const highlights = [...prev.highlights];
      highlights[idx] = val;
      return { ...prev, highlights };
    });
  };

  const removeHighlight = (idx) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  // Tech tags handlers
  const handleAddTech = (e) => {
    e.preventDefault();
    const tag = techInput.trim();
    if (tag && !form.tech.includes(tag)) {
      setForm((prev) => ({ ...prev, tech: [...prev.tech, tag] }));
      setTechInput('');
    }
  };

  const removeTech = (tag) => {
    setForm((prev) => ({ ...prev, tech: prev.tech.filter((t) => t !== tag) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Project title is required.');
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      id:
        form.id.trim() ||
        form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      github: form.github.trim() || null,
      githubUrl: form.github.trim() || null,
      liveDemo: form.liveDemo.trim() || null,
      liveUrl: form.liveDemo.trim() || null,
      figmaLink: form.figmaLink.trim() || null,
      figmaUrl: form.figmaLink.trim() || null,
      metrics: form.metrics.filter((m) => m.label.trim() && m.value.trim()),
      highlights: form.highlights.filter((h) => h.trim()),
      tech: form.tech,
      techStack: form.tech,
    };

    onSubmit(payload);
  };

  return {
    form,
    techInput,
    setTechInput,
    error,
    updateField,
    addMetric,
    updateMetric,
    removeMetric,
    addHighlight,
    updateHighlight,
    removeHighlight,
    handleAddTech,
    removeTech,
    handleSubmit,
  };
}
