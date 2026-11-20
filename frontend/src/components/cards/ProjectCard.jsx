import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, FileText, CheckCircle2, ShoppingCart } from 'lucide-react';
import Badge from '../common/Badge';
import { useCart } from '../../context/CartContext';

export const ProjectCard = ({ project }) => {
  const { toggleWishlist, isInWishlist, addToCart, isInCart } = useCart();
  const wishlisted = isInWishlist(project.id);
  const inCart = isInCart(project.id);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full hover:border-emerald-300">
      {/* Thumbnail with Overlay Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={project.screenshots[0]}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Floating Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(project.id);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
            wishlisted 
              ? 'bg-red-50 text-red-600 shadow-sm' 
              : 'bg-white/80 text-slate-600 hover:text-red-600 hover:bg-white'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Degree & Semester Ribbon */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-slate-900/85 backdrop-blur-sm text-gold-soft font-semibold text-[11px] px-2 py-0.5 rounded shadow">
            {project.degree} &bull; Sem {project.semester}
          </span>
          <span className="bg-gold text-white font-medium text-[10px] px-2 py-0.5 rounded shadow">
            {project.difficulty}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Subject & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-navy-mid bg-ivory px-2 py-0.5 rounded">
              {project.subject}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{project.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({project.reviewsCount})</span>
            </div>
          </div>

          {/* Project Title */}
          <Link to={`/project/${project.slug}`} className="block mt-2">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-navy-mid transition-colors">
              {project.title}
            </h3>
          </Link>

          {/* Summary */}
          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>

          {/* Technology Pills */}
          <div className="mt-3 flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Price & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Price (PKR)</span>
            <span className="text-base font-bold text-slate-900">
              Rs. {project.pricePKR.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addToCart(project)}
              className={`p-2 rounded-lg transition-colors border ${
                inCart 
                  ? 'bg-ivory text-navy-mid border-emerald-300' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-gold'
              }`}
              title={inCart ? 'Already in Cart' : 'Add to Cart'}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>

            <Link
              to={`/project/${project.slug}`}
              className="px-3 py-1.5 bg-gold hover:bg-navy-mid text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              View Package
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
