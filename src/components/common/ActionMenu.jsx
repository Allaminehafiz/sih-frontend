import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";

const ActionMenu = ({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  customActions = [],
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleActionClick = (action) => {
    setOpen(false);
    if (action) action();
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
      >
        <Icon name="more_vert" size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-50">
          {/* Actions personnalisées (ex: changement de statut) */}
          {customActions.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick(item.action);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition-colors"
            >
              <Icon name="swap_horiz" size={16} />
              {item.label}
            </button>
          ))}

          {/* Action d'édition classique (si fournie) */}
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick(onEdit);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition-colors"
            >
              <Icon name="edit" size={16} />
              {editLabel}
            </button>
          )}

          {/* Action de suppression (toujours affichée si fournie) */}
          {onDelete && (
            <>
              {/* Séparateur s'il y a d'autres actions */}
              {(customActions.length > 0 || onEdit) && (
                <div className="border-t border-gray-100 my-1"></div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionClick(onDelete);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 transition-colors"
              >
                <Icon name="delete" size={16} />
                {deleteLabel}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;