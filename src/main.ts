interface Plat {
  nom: string,
  prix: number
  decription: string;
}


const carte: Plat[] = [
  {nom: "Anchois 23cm", prix: 7.90, decription:"sauce tomate premium, origan, huile d'olive extra vierge, anchois, olive"},
  {nom: "Anchois 33cm", prix: 11.90 , decription:"sauce tomate premium, origan, huile d'olive extra vierge, anchois, olive"},
  {nom: " Emmental 23cm", prix: 7.9, decription:"sauce tomate premium, origan, huile d'olive extra vierge, emmental, basilic, olive"},
];


console.log(carte)