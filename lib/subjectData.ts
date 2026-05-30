// Static configuration for school subject lessons, notebook doodles, and math formulas

export interface RichLesson {
    name: string;
    description: string;
    index: number;
}

export interface SubjectStaticData {
    name: string;
    subtitle: string;
    footerText: string;
    lessons: RichLesson[];
}

export const subjectStaticData: Record<string, SubjectStaticData> = {
    "mathematics": {
        name: "Mathematics",
        subtitle: "Explore all lessons and topics.",
        footerText: "Knowledge is power. Keep learning!",
        lessons: [
            {
                index: 1,
                name: "Sets and Relations",
                description: "Basics of sets, types of sets, and relations."
            },
            {
                index: 2,
                name: "Functions",
                description: "Definition, types of functions and examples."
            },
            {
                index: 3,
                name: "Algebraic Expressions",
                description: "Variables, terms, coefficients and simplification."
            },
            {
                index: 4,
                name: "Quadratic Equations",
                description: "Solving quadratic equations by factoring, completing the square and formula."
            },
            {
                index: 5,
                name: "Sequences and Series",
                description: "Arithmetic and geometric sequences and their applications."
            },
            {
                index: 6,
                name: "Binomial Theorem",
                description: "Binomial expansion and properties."
            },
            {
                index: 7,
                name: "Matrices and Determinants",
                description: "Introduction to matrices and determinants."
            },
            {
                index: 8,
                name: "Trigonometry",
                description: "Trigonometric ratios, identities and equations."
            },
            {
                index: 9,
                name: "Coordinate Geometry",
                description: "Lines, circles, parabolas and ellipses."
            },
            {
                index: 10,
                name: "Limits and Continuity",
                description: "Limits, continuity and differentiability."
            },
            // Fallbacks for DB seeded items if name doesn't match above exactly
            {
                index: 11,
                name: "Linear Algebra",
                description: "Vector spaces, matrices, linear transformations, and eigenvectors."
            },
            {
                index: 12,
                name: "Calculus I",
                description: "Limits, derivatives, differentiation rules, and standard optimization."
            },
            {
                index: 13,
                name: "Calculus II",
                description: "Techniques of integration, applications of definite integrals, and series."
            },
            {
                index: 14,
                name: "Discrete Mathematics",
                description: "Logic, set theory, graph theory, combinatorics, and mathematical proofs."
            },
            {
                index: 15,
                name: "Probability and Statistics",
                description: "Probability distributions, hypothesis testing, and regression analysis."
            },
            {
                index: 16,
                name: "Abstract Algebra",
                description: "Groups, rings, fields, and algebraic ring structures."
            }
        ]
    },
    "computer-science": {
        name: "Computer Science",
        subtitle: "Unlocking the logic that powers our digital world.",
        footerText: "Think twice, code once. Happy hacking!",
        lessons: [
            {
                index: 1,
                name: "Intro to Programming",
                description: "Variables, control structures, and writing basic algorithms in high-level syntax."
            },
            {
                index: 2,
                name: "Data Structures and Algorithms",
                description: "Arrays, lists, trees, and graphs combined with searching and sorting algorithms."
            },
            {
                index: 3,
                name: "Web Development",
                description: "Full-stack architectures, modern frameworks, dynamic interfaces, and protocols."
            },
            {
                index: 4,
                name: "Operating Systems",
                description: "Process synchronization, threading, memory allocation, scheduling, and kernels."
            },
            {
                index: 5,
                name: "Database Systems",
                description: "Relational modeling, entity relationships, SQL querying, indexing, and transactions."
            },
            {
                index: 6,
                name: "Artificial Intelligence",
                description: "Neural network design, heuristics, genetic algorithms, and machine learning structures."
            },
            {
                index: 7,
                name: "Computer Architecture",
                description: "CPU logic gates, machine cycles, assembly programming, and register mechanics."
            },
            {
                index: 8,
                name: "Software Engineering",
                description: "Design patterns, Agile methodologies, CI/CD pipes, testing frameworks, and version control."
            },
            {
                index: 9,
                name: "Networks and Communications",
                description: "TCP/IP layers, routing protocol architectures, socket connections, and DNS mechanisms."
            },
            {
                index: 10,
                name: "Cyber Security",
                description: "Cryptographic keys, hashing algorithms, penetration testing, and security protocols."
            }
        ]
    },
    "chemistry": {
        name: "Chemistry",
        subtitle: "Investigating the fundamental reactions of elements.",
        footerText: "Keep experimenting. The solution is in the chemistry!",
        lessons: [
            {
                index: 1,
                name: "General Chemistry",
                description: "Basic atomic models, molar stoichiometry, and molecular structures."
            },
            {
                index: 2,
                name: "Organic Chemistry",
                description: "Hydrocarbon chains, functional groups, and complex stereochemical reaction pathways."
            },
            {
                index: 3,
                name: "Analytical Chemistry",
                description: "Quantitative analysis, chromatographies, titration rules, and mass spectrometry."
            },
            {
                index: 4,
                name: "Biochemistry",
                description: "Amino acids, enzyme kinetics, DNA synthesis, and biochemical energy transformations."
            },
            {
                index: 5,
                name: "Physical Chemistry",
                description: "Thermodynamic laws, quantum spectroscopy, and molecular kinetic theory."
            },
            {
                index: 6,
                name: "Inorganic Chemistry",
                description: "Transition metals, coordination compound complexes, and crystal field geometries."
            },
            {
                index: 7,
                name: "Chemical Kinetics",
                description: "Reaction rates, collision theories, transition state states, and catalyst paths."
            },
            {
                index: 8,
                name: "Electrochemistry",
                description: "Galvanic batteries, redox balance equations, electrolysis cells, and Nernst equations."
            },
            {
                index: 9,
                name: "Coordination Compounds",
                description: "Ligands, coordination number geometries, structural isomerism, and bonding theories."
            },
            {
                index: 10,
                name: "Polymer Chemistry",
                description: "Polymerization processes, elastomers, molecular weights, and plastic structures."
            }
        ]
    },
    "physics": {
        name: "Physics",
        subtitle: "Exploring the fundamental rules of the cosmos.",
        footerText: "Energy cannot be created or destroyed. Keep moving!",
        lessons: [
            {
                index: 1,
                name: "Classical Mechanics",
                description: "Newtonian kinetics, gravity coordinates, work, energy constants, and momentum."
            },
            {
                index: 2,
                name: "Electromagnetism",
                description: "Maxwell's equations, electrostatic forces, circuits, and electromagnetic waves."
            },
            {
                index: 3,
                name: "Thermodynamics",
                description: "Thermal cycles, entropy values, engine efficiencies, and thermodynamics laws."
            },
            {
                index: 4,
                name: "Quantum Mechanics",
                description: "Wave-particle duality, Schrödinger equations, tunneling effects, and atom states."
            },
            {
                index: 5,
                name: "Optics",
                description: "Geometric reflection, wobbly light diffraction, lens properties, and laser mechanisms."
            },
            {
                index: 6,
                name: "Relativity",
                description: "Special relativity space-time dilations, Lorentz shifts, and general gravitational curves."
            },
            {
                index: 7,
                name: "Statistical Mechanics",
                description: "Microstate distributions, partition functions, thermodynamics, and entropy mappings."
            },
            {
                index: 8,
                name: "Particle Physics",
                description: "Quarks, leptons, gauge bosons, Feynman diagram lines, and standard models."
            },
            {
                index: 9,
                name: "Astrophysics",
                description: "Stellar evolutions, black holes, expansion variables, and orbital cosmologies."
            },
            {
                index: 10,
                name: "Condensed Matter Physics",
                description: "Crystal lattice structures, band structures, semiconductor mechanics, and superconductivity."
            }
        ]
    }
};
