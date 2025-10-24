import { NextRequest, NextResponse } from 'next/server';

// 1980s Animation DNA Tropes
const ANIMATION_TROPES = [
  {
    name: "Speed Lines",
    description: "Dynamic motion lines radiating from moving objects, intense action blur effects"
  },
  {
    name: "Transformation Sequence",
    description: "Multi-stage metamorphosis with glowing auras, spinning silhouettes, and dramatic pose reveals"
  },
  {
    name: "Cel Shading",
    description: "Bold flat colors with hard shadow edges, high contrast lighting, limited color palette"
  },
  {
    name: "Chromatic Aberration",
    description: "VHS-style color bleeding, RGB split, analog video distortion"
  },
  {
    name: "Energy Auras",
    description: "Glowing power fields, crackling electricity, radiating light beams around characters"
  },
  {
    name: "Stock Footage Loop",
    description: "Repeating background cycles, reused animation frames, cyclical movement patterns"
  },
  {
    name: "Limited Animation",
    description: "Static holds with only mouth/eyes moving, sliding cels, minimal frame counts"
  },
  {
    name: "Dramatic Hair Physics",
    description: "Gravity-defying hair flow, slow-motion hair billowing, impossible hair volume and movement"
  },
  {
    name: "Lens Flares",
    description: "Bright hexagonal light bursts, sun glare effects, prismatic light rays"
  },
  {
    name: "Mecha Design",
    description: "Geometric robot forms, panel lines, mechanical joints, angular armor plating"
  },
  {
    name: "Thunder Effects",
    description: "Electric lightning bolts, crackling energy, dramatic sky flashes"
  },
  {
    name: "Sweat Drops",
    description: "Large stylized sweat beads, stress marks, comic relief visual indicators"
  },
  {
    name: "Screen Tone Patterns",
    description: "Halftone dots, crosshatching, manga-style gradient patterns"
  },
  {
    name: "Explosion Frames",
    description: "Bright white flash frames, debris silhouettes, expanding fireball rings"
  },
  {
    name: "Pastel Gradient Backgrounds",
    description: "Soft color transitions, dreamy atmosphere, ethereal lighting washes"
  },
  {
    name: "Grid Worlds",
    description: "Digital grid floors, neon wire-frame environments, vector-line horizons"
  },
  {
    name: "Chrome Reflection",
    description: "Metallic surfaces, mirror-like finishes, rainbow sheen effects"
  },
  {
    name: "Star Field Voids",
    description: "Infinite space backgrounds, twinkling stars, cosmic nebula clouds"
  },
  {
    name: "Impact Freeze Frames",
    description: "Still frame on hit contact, white flash, shockwave rings"
  },
  {
    name: "Chibi Deformation",
    description: "Super-deformed proportions, oversized heads, simplified cute features"
  },
  {
    name: "Radical Color Palettes",
    description: "Hot pink, electric cyan, neon purple, acid green combinations"
  },
  {
    name: "Geometric Transitions",
    description: "Diamond wipes, star wipes, rotating shape transitions between scenes"
  },
  {
    name: "Pilot Cockpit POV",
    description: "First-person view with HUD elements, targeting displays, instrument panels"
  },
  {
    name: "Beam Weapons",
    description: "Concentrated energy blasts, laser streams, colorful projectile trails"
  }
];

function getRandomTropes(count: number = 3): typeof ANIMATION_TROPES {
  const shuffled = [...ANIMATION_TROPES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function transformPrompt(originalPrompt: string): { transformed: string; tropes: string[] } {
  const selectedTropes = getRandomTropes(Math.floor(Math.random() * 3) + 2); // 2-4 tropes

  let transformed = originalPrompt;

  // Add 80s animation DNA to the prompt
  const tropeDescriptions = selectedTropes.map(t => t.description).join(', ');
  const styleAddition = `1980s anime style with ${tropeDescriptions}`;

  // Intelligently inject the style
  if (transformed.toLowerCase().includes('style')) {
    transformed = transformed.replace(/style/i, `${styleAddition} style`);
  } else {
    transformed = `${transformed}, ${styleAddition}`;
  }

  // Add additional 80s keywords
  const additionalKeywords = [
    'retro 1980s aesthetic',
    'VHS quality',
    'cel animation',
    'nostalgic Saturday morning cartoon',
    'hand-drawn frame',
    'analog video look'
  ];

  const randomKeywords = additionalKeywords
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .join(', ');

  transformed = `${transformed}, ${randomKeywords}`;

  return {
    transformed,
    tropes: selectedTropes.map(t => t.name)
  };
}

function extractPromptsFromText(text: string): string[] {
  // Split by common delimiters
  const lines = text.split(/\n+/);

  const prompts: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines, headers, page numbers, etc.
    if (!trimmed || trimmed.length < 20) continue;
    if (/^(page|\d+|chapter|section)/i.test(trimmed)) continue;

    // Look for prompt-like content (descriptions, scenes, etc.)
    if (trimmed.length > 30 && trimmed.length < 1000) {
      // Clean up the prompt
      let cleaned = trimmed
        .replace(/^\d+[\.\)]\s*/, '') // Remove numbering
        .replace(/^[-•*]\s*/, '') // Remove bullet points
        .trim();

      if (cleaned.length > 20) {
        prompts.push(cleaned);
      }
    }
  }

  return prompts;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Convert PDF to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Simple text extraction (for demo purposes)
    // In production, you'd use pdf-parse or similar
    const text = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000));

    // Extract prompts from text
    let prompts = extractPromptsFromText(text);

    // If no prompts found, create sample prompts for demo
    if (prompts.length === 0) {
      prompts = [
        "A futuristic cityscape at sunset with flying vehicles",
        "A warrior princess standing on a cliff overlooking the ocean",
        "A team of heroes in colorful armor preparing for battle",
        "A mystical forest with glowing plants and magical creatures",
        "A space station orbiting a distant planet"
      ];
    }

    // Limit to reasonable number of prompts
    prompts = prompts.slice(0, 20);

    // Transform each prompt
    const results = prompts.map(prompt => {
      const { transformed, tropes } = transformPrompt(prompt);
      return {
        original: prompt,
        transformed,
        tropes
      };
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF file' },
      { status: 500 }
    );
  }
}
